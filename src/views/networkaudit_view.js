'use strict';

const AppUI = require('../libs/app-ui');
var dashboardTmpl = require('raw-loader!../templates/networkaudit/dashboard.html');
var leftPanelTmpl = require('raw-loader!../templates/networkaudit/left-pane.html');
const rulesTmpl = require('raw-loader!../templates/networkaudit/rule.html');
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
    
    render: function () {
        this.loadDashboard();
        AppUI.I().Tabs().setContent({
            id: this.tabId,
            content: dashboardTmpl
        });
        this.loadLeftPane();
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
            title: '<img src="assets/images/discrepancy_black_100.png" \
                width="16px" class="img-icon"/> Network Audit</b>',
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
        AppUI.I().ModuleMenuBar().setTitle('<img src="assets/images/discrepancy_black_100.png" width="32px" class="img-icon"/> Network Audit	');

        AppUI.I().getLeftModuleArea().html(leftPanelTmpl);

        //Load ACI Tree of rules and categories
        try {
            var aciTreeAPI = $('#bd_auditrules_tree').aciTree({
                ajax: {
                url: 'http://localhost:8080/api/networkaudit/acitree/categories/0',
                data: {
                    searchRules: function () {
                        return $(that.$el).find('[name=bd_filter_audit_rules]').is(':checked');
                    },
                    searchCategories: function () {
                        return $(that.$el).find('[name=bd_filter_audit_cats]').is(':checked');
                    },
                    searchTerm: function () {
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

                    //Category context menu items
                    if (properties['nodeType'] == 'category'){

                        //Reload rules under category
                        menu['reload_category'] = {
                            name: 'Refresh',
                                callback: function() {
                                    api.unload(item, {
                                        success: function(){ 
                                                    api.ajaxLoad(item, {
                                                        success: function(){
                                                            api.open(item);
                                                        }, 
                                                        fail: function(){}, unanimated: false}); 
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
                                that.loadAuditRule(itemId);
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
    loadAuditRule: function(ruleId){
        var that = this;
        var tabId = this.tabId + '_audit_rule_' + ruleId;

        AppUI.I().Tabs().addTab({
            id: tabId,
            title: 'Loading rule...',
            content: this.ruleTableTemplate({ruleName: 'Loading ...'})
            //content: AppUI.I().Loading('<h3>Loading network audit rule...</h3>')
        });
        AppUI.I().Tabs().show({id: tabId});
        
        //Get rule details 
        var auditRuleModel = new AuditRuleModel({id: ruleId});
        auditRuleModel.fetch({success: function(model,response,options){
            AppUI.I().Tabs().setTitle({
                id: tabId,
                title: model.get("name"),
            });
            
            $('#' + tabId + ' h1').html(model.get("name"));

        }});

        //console.log(auditRuleModel);
        
        //Construct tr for table header and footer
        var tr = '';
        var ruleFields = [];
        //Get rule fields and create datatable html
       var auditRuleFieldCollection = new AuditRuleFieldCollection();
       auditRuleFieldCollection.fetch({
           success: function(collection){
               
               _(collection.models).each(function(model){
                   tr += '<th>'+model.get('name') + '</th>';
                   ruleFields.push({name:model.get("name"), data: model.get("name")});
               });
               tr = '<tr>' + tr + '</tr>';
               
               var ruleDTId = 'rule_dt_' + ruleId;
               
               //Build table
               var tableHtml = '<table id="'+ruleDTId+'" class="table table-striped table-bordered dataTable" width="100%">';
               tableHtml += '<thead>' + tr + '</thead>';
               tableHtml += '<tfoot>' + tr + '</tfoot>';
               tableHtml += '</table>';
               
               //Add html to tab content area
               $('#'+tabId + ' .rule-datatable').html(tableHtml);

               //Initiate datatable
               $('#'+ruleDTId).DataTable({
                    //"scrollX": true,
                    "pagingType": 'full_numbers', 
                    "processing": true,
                    "serverSide": true,
                    "ajax": {
                        "url": 'http://localhost:8080/api/networkaudit/rule/dt_data/'+ruleId,
                        "type": "POST",
                        'contentType': 'application/json',
                        'data': function(d) {
				return JSON.stringify(d);
			}
                    },
                    "columns": ruleFields,
                    "language": {
                        "zeroRecords": "No matching data found",
                        "emptyTable": "Audit rule has no data."
                    },
               });
           }
       });
     
       
    }
});

module.exports = NetworkAuditView;