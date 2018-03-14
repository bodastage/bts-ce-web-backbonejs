'use strict';
/**
 * Network Audit Module User Interface
 * 
 * @version 1.0.0
 * @author Bodastage Solutions
 */

var dashboardTmpl = require('html-loader!../templates/networkaudit/dashboard.html');
var leftPanelTmpl = require('html-loader!../templates/networkaudit/left-pane.html');
var rulesTmpl = require('html-loader!../templates/networkaudit/rule.html');
var rulesGraphTmpl = require('raw-loader!../templates/networkaudit/rule-count-graph.html');
var AuditRuleFieldCollection = require('../collections/audit_rule_field_collection');
var AuditRuleModel = require('../models/audit_rule_model');

var NetworkAuditView = Backbone.View.extend({
    el: 'body',

    //tab Id for the network audit dashboard
    tabId: 'tab_networkaudit',
    
    /**
     * HTML template for the rules tab
     */
    ruleTableTemplate: _.template(rulesTmpl),
    
    events: {
        "click .launch-audit-rule-tree": "loadLeftPane",
        "click .refresh-netaudit-tree": "refreshNetAuditTree",
    },
    
    render: function () {
        this.loadDashboard();
        AppUI.I().Tabs().setContent({
            id: this.tabId,
            content: dashboardTmpl
        });
    },

    /**
     * Initialize view
     * 
     * @version 1.0.0
     * @return void
     */
    initialize: function () {
        this.render();
    },

    /**
     * Load module dashboard
     *  
     * @version 1.0.0
     * @return void
     */
    loadDashboard: function () {
        AppUI.I().Tabs().addTab({
            id: this.tabId,
            title: '<i class="fa fa-wrench"></i> Network Audit',
            content: AppUI.I().Loading('<h3>Loading network audit module...</h3>')
        });
        AppUI.I().Tabs().show({id: this.tabId});
    },

    /**
     * Load left pane
     * 
     * @returns void
     */
    loadLeftPane: function () {
        var that = this;
        AppUI.I().ModuleMenuBar().setTitle('<i class="fa fa-wrench"></i> Network Audit	');

        AppUI.I().getLeftModuleArea().html(leftPanelTmpl);
        
        //Spin refresh icon while the tree loads
        $('.refresh-netaudit-tree').addClass('fa-spin');
        $('#bd_auditrules_tree').on('acitree', function(event, api, item, eventName, options) {
            if(eventName === 'init' || eventName === 'wasloaded'){
                $('.refresh-netaudit-tree').removeClass('fa-spin');
            }
        });

        //Load ACI Tree of rules and categories
        try {
            this.aciTreeInstance = $('#bd_auditrules_tree').aciTree({
                ajax: {
                url: API_URL + '/api/networkaudit/tree/categories/0',
                data: {
                    "search_rules": function () {
                        return $(that.$el).find('[name=bd_filter_audit_rules]').is(':checked');
                    },
                    "search_categories": function () {
                        return $(that.$el).find('[name=bd_filter_audit_cats]').is(':checked');
                    },
                    "search_term": function () {
                        return $(that.$el).find('#bd_audit_filter').val();
                    }
                }//oef:data
            },
            ajaxHook: function (item, settings) {

                //Change the URL to rules if the parent is categories	
                if (item) { // id is not null
                    settings.url = settings.url.replace('categories', 'rules');
                }
                settings.url += (item ? this.getId(item) : '');
            },
            itemHook: function (parent, item, itemData, level) {
                var properties = this.itemData(item);
                if (properties['nodeType'] == 'category') {
                    $('#bd_auditrules_tree').aciTree('api').addIcon(item,
                    {
                        success: function (item, options) {},
                        fail: function (item, options) {},
                        icon: 'bd-aciTree-glyphicon glyphicon glyphicon-tags '
                    });
                } else {//rule: 
                    $('#bd_auditrules_tree').aciTree('api').addIcon(item,
                        {
                            success: function (item, options) {},
                            fail: function (item, options) {},
                            icon: 'bd-aciTree-glyphicon glyphicon glyphicon-tint '
                        });
                }

            }
            });

            //Trigger search when the rules and category checkboxes are checked
            $('[name=bd_filter_audit_rules],[name=bd_filter_audit_cats]').on('change', function () {
                $('#bd_audit_filter').trigger('keyup');
            });

            //Keyup event on the rule search text field. When the user types some text in the search field
            //the aciTree is reloaded to show the filtered results.
            $('#bd_audit_filter').on('keyup', function () {
                $('#bd_auditrules_tree').aciTree('api').unload(null,{
                    success: function () {
                        $('#bd_auditrules_tree').aciTree('api').ajaxLoad();
                    }
                });
            });

                //Category and rules context menu
            $('#bd_auditrules_tree').contextMenu({
                selector: '.aciTreeLine',
                build: function(element){
                var menu = {};
                    var api = $('#bd_auditrules_tree').aciTree('api');
                    var item = api.itemFrom(element);
                    var itemId = api.getId(item);
                    var properties = api.itemData(item);
                    var itemLabel = api.getLabel(item);
                    var parentLabel = api.getLabel(api.parent(item));
                    
                    //Category context menu items
                    if (properties['nodeType'] == 'category'){

                        //Reload rules under category
                        menu['reload_category'] = {
                            name: 'Refresh',
                            callback: function () {
                                api.unload(item, {
                                    success: function () {
                                        api.ajaxLoad(item, {
                                            success: function () {
                                                api.open(item);
                                            },
                                            fail: function () {}, unanimated: false});
                                    }
                                });
                            }//eof:callback
                        };
                    }//eof: nodeType == category

                    //Audit rule context menu items
                    if(properties['nodeType'] == 'rule'){
                        menu['load_rule']  = {
                            name: 'Load',
                            callback: function() {
                                that.loadAuditRule(itemId, itemLabel, parentLabel);
                            }//eof:callback
                        };

                    }//eof: nodeType == rule

                    return {
                        autoHide: true,
                        items: menu
                    };
                }
            });//eof:contexMenu

        }catch(err) {
            console.log(err);
        }


    },
    
    /*
     * Load audit rule
     * 
     * @param integer ruleId
     * 
     * @version 1.0.0
     * @since 1.0.0
     * @return void
     */
    loadAuditRule: function(ruleId, ruleName, parentName){
        var that = this;
        var tabId = this.tabId + '_audit_rule_' + ruleId;

        AppUI.I().Tabs().addTab({
            id: tabId,
            title: '<i class="fa fa-wrench"></i> ' + parentName + "/" + ruleName,
            content: this.ruleTableTemplate({ruleName: 'Loading ...'})
            //content: AppUI.I().Loading('<h3>Loading network audit rule...</h3>')
        });
        AppUI.I().Tabs().show({id: tabId});

        //Construct tr for table header and footer
        var tr = '';
        var ruleFields = [];
       
        $.ajax({
            url: API_URL + '/api/networkaudit/rule/fields/' + ruleId,
            type: "GET",
            data: {},
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {
                //Load the html template for the mo datatable
                AppUI.I().Tabs().setContent({
                    id: tabId, 
                    content: (_.template(rulesTmpl))({ruleName: parentName + '/' + ruleName})
                });

                var ruleDTId = 'rule_dt_' + ruleId;
                
                //Construct tr for table header and footer
                var tr = '';
                var ruleFields = [];
                var columnDefs = []
                
                var fieldIndex = -1;
                //Construct the tr data and also populate ruleFields array
               _(data).each(function(field){
                   fieldIndex++;
                   
                   tr += '<th>'+field + '</th>';
                   
                   //Class to use for drop targets
                   var filterCls='drop-target-'+field+'-'+ruleDTId;
                   
                   //Add columnDefinitions
                   if(field === 'pk' || field === 'added_by' || field === 'modified_by'){//Hide pk column
                       columnDefs.push({ "visible": false,  "targets": [ fieldIndex ] });
                   }

                   if( field === 'date_added'){
                       var title = 'date_first_found';
                       ruleFields.push({name:field, data: field , title: '<span onclick=" event.stopPropagation();" class="glyphicon glyphicon-filter  filter-icon '+filterCls+'"></span>'+title + '&nbsp;' });
                       return;
                   }
                   
                   if( field === 'date_modified'){
                       var title = 'date_last_found';
                       ruleFields.push({name:field, data: field , title: '<span onclick=" event.stopPropagation();" class="glyphicon glyphicon-filter  filter-icon '+filterCls+'"></span>'+title + '&nbsp;' });
                       return;
                   }
                   
                   ruleFields.push({name:field, data: field , title: '<span onclick=" event.stopPropagation();" class="glyphicon glyphicon-filter  filter-icon '+filterCls+'"></span>'+field + '&nbsp;' });
                   
               });
               tr = '<tr>' + tr + '</tr>';
               
//               console.log(columnDefs);
//               console.log(ruleFields);
               
               //Build table
               var tableHtml = '<table id="'+ruleDTId+'" class="table table-striped table-bordered dataTable" width="100%">';
               tableHtml += '<thead>' + tr + '</thead>';
               tableHtml += '<tfoot>' + tr + '</tfoot>';
               tableHtml += '</table>';
               
               $('#'+tabId + ' .rule-datatable').html(tableHtml);

               //Initiate datatable to display rules data
               var ruleDataTable = $('#'+ruleDTId).DataTable({
                    "scrollX": true,
                    "scrollY": true,
                    "pagingType": 'full_numbers', 
                    "processing": true,
                    "serverSide": true,
                     colReorder: true,
                    "ajax": {
                        "url": API_URL + '/api/networkaudit/rule/dt/'+ruleId,
                        "type": "GET",
                        'contentType': 'application/json'
                    },
                    "columns": ruleFields,
                    "columnDefs": columnDefs,
                    "language": {
                        "zeroRecords": "No matching data found",
                        "emptyTable": "Audit rule has no data."
                    },
                    "dom": 
                        "<'row'<'col-sm-9'l><'col-sm-3'f>>" +
                        "<'row'<'col-sm-12'tr>>" +
                        "<'row'<'col-sm-5'i><'col-sm-7'p>>", 
                    "initComplete": function(){
                        
                        //Refresh button
                        $('#'+ruleDTId + '_wrapper .dataTables_length').append(' <span class="btn btn-default"><i class="fa fa-refresh"></i></span>');
                        $('#'+ruleDTId + '_wrapper .dataTables_length .fa-refresh').click(function(){
                            ruleDataTable.api().ajax.reload();
                        });
                        //----------------------------------
                        
                        
                        //Download button
                        $('#'+ruleDTId + '_wrapper .dataTables_length').append(' <span class="btn btn-default export-csv"><i class="fa fa-cloud-download"></i></span>');
                        $('#'+ruleDTId + '_wrapper .dataTables_length .export-csv').click(function(){
                            window.location.href = API_URL + '/api/networkaudit/download/rule/' + ruleId;
                        });
                        //----------------------------------
                        
                        //Add per column filtering
                        _.forEach(ruleFields, function(field, idx){

                            //pk is hidden
                            if(field.name === 'pk' || field.name === 'added_by' 
                                    || field.name === 'modified_by'){ return;}

                             var filterCls='drop-target-'+field.name+'-'+ruleDTId;
                             var filterId ='drop_target_'+field.name +'_'+ruleDTId;;
                              
                            var advancedFilterHtml = '\
                            <div class="" class="advanced-filter" id="'+filterId+'">\
                                <input type="text" placeholder="Search..." value="" \
                                    class="form-control per-column-search" data-column-index='+idx+' \
                                    data-column-name="'+field.name+'"/>\
                                <div></div>\
                            </div>\
                            ';
                             
                            var dropInstance = new Drop({
                                target: document.querySelector('.' + filterCls),
                                content: advancedFilterHtml,
                                classes: 'drop-theme-arrows',
                                position: 'bottom center',
                                openOn: 'click'
                              });
                              
                              
                            //Add filtering logic  
                            $('body').on('input','#' +filterId+ ' input.per-column-search', function(){
                                var colIdx = $(this).data('column-index');
                                var colName= $(this).data('column-name');

                                //@TODO: sanitize class name
                                var filterCls='drop-target-'+colName+'-'+ruleDTId;
                                //var filterId ='drop_target_'+colName +'_'+moDTId;;


                                ruleDataTable.api().column(colIdx).search($(this).val()).draw();
                                var searchValue = $(this ).val();

                                //Highlight wich columns have filters on by 
                                //changing the filter color to blue
                                if(searchValue != ""){
                                    $('.' + filterCls ).css("color","#2e6da4");
                                }else{
                                    $('.' + filterCls ).css("color","#999996");
                                }


                            });
                         });
                         //eof:add per column filtering
                         //----------------------------------
                                   
    

                    }//eof: initComplete
               });


            }
        });

    },
    
    /**
     * Rule count graph
     */
    loadCoundGraph: function(options){
        var that = this;
        var tabId = options.ruleTabId + '_graph';
        var ruleId = options.ruleId;
        var ruleName = options.ruleName;
        var ruleCountGraphDiv = tabId+'_graph_id';
        
        AppUI.I().Tabs().addTab({
            id: tabId,
            title: '<i class="fa fa-area-chart "></i> ' + ruleName,
            content: _.template(rulesGraphTmpl)({
                ruleName: '<i class="fa fa-area-chart "></i> ' + ruleName,
                ruleCountGraphId: ruleCountGraphDiv})
            //content: AppUI.I().Loading('<h3>Loading count graph</h3>')
        });
        
        //Graph
        var trace1 = {
          x: [1, 2, 3, 4],
          y: [10, 15, 13, 17],
          mode: 'markers'
        };

        var trace2 = {
          x: [2, 3, 4, 5],
          y: [16, 5, 11, 9],
          mode: 'lines'
        };

        var trace3 = {
          x: [1, 2, 3, 4],
          y: [12, 9, 15, 12],
          mode: 'lines+markers'
        };

        var data = [ trace1, trace2, trace3 ];

        var layout = {
          title:'Line and Scatter Plot'
        };
        Plotly.newPlot(ruleCountGraphDiv , data, layout);
    },
    
    /**
     * Refresh network audit tree
     * 
     * @version 1.0.0
     */
    refreshNetAuditTree: function(){
        $('.refresh-netaudit-tree').addClass('fa-spin');
        $('#bd_auditrules_tree').aciTree('api').ajaxLoad();
    }
});

module.exports = NetworkAuditView;