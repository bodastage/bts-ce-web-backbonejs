'use strict';
/**
 * MO Browser Module
 * 
 * @version 1.0.0
 * @author Bodastage Solutions<info@bodastage.com>
 */
var dashboardTemplate = require('html-loader!../templates/mobrowser/dashboard.html');
var moTemplate = require('html-loader!../templates/mobrowser/mo.html');
var leftPaneTemplate = require('html-loader!../templates/mobrowser/left-pane.html');

//@TODO: These seem to call the api before they are needed. It is slowing the page load times. Change it.
var VendorsCollection = require('../collections/vendors_collection');
var TechCollection = require('../collections/technologies_collection');

var MOBrowserView = Backbone.View.extend({
    el: 'body',

    //tab Id for the mobule dashboard
    tabId: 'tab_mobrowser',

    //Template
    template: _.template(dashboardTemplate),
    moTableTemplate: _.template(moTemplate),
    
    "events": {
        "click .launch-mo-tree-browser": "loadLeftPanel"
    },
    /**
     * Reloading the module.
     * 
     * @since 1.0.0
     * @version 1.0.0
     */
    reload: function () {
        this.render();
    },
    render: function () {
        this.loadDashboard();
    },
    

    /**
     * Load module dashboard
     *  
     * @version 1.0.0
     * @return void
     */
    loadDashboard: function () {
        var tabId = this.tabId;
        
        AppUI.I().Tabs().addTab({
            id: this.tabId,
            title: '<i class="fa fa-puzzle-piece"></i> MO Browser',
            content: AppUI.I().Loading('<h3>Loading MO Browser module...</h3>')
        });
        AppUI.I().Tabs().show({id: this.tabId});
        
        AppUI.I().Tabs().setContent({
            id: tabId,
            content: this.template()
        });
        
    },

    /**
     * Load left pane with tree browser
     * 
     * @since 1.0.0
     * 
     * @returns void
     */
    loadLeftPanel: function () {
        var that = this;
        
        AppUI.I().ModuleMenuBar().setTitle('<i class="fa fa-puzzle-piece"></i> MO Browser');
        AppUI.I().getLeftModuleArea().html(leftPaneTemplate);
        
        //Add vendors
        var vendorsCollection = new VendorsCollection();
        //vendorsCollection.fetch({async:false});
        var vendorField = $(that.$el).find('#bd_mobrowser_select_vendor');
        vendorsCollection.fetch({success: function(collection,response,options){
            _(collection.models).each(function(vendor){
                    var _h = '<option value="'+vendor.get("id")+'">'+vendor.get("name")+'</option>';
                    $(vendorField).append(_h);
            });
        }});
        
        //Add technolgoies
        var techCollection = new TechCollection();
        var techField = $(that.$el).find('#bd_mobrowser_select_tech');
        techCollection.fetch({success: function(collection,response,options){
            _(collection.models).each(function(tech){
                var _h = '<option value="'+tech.get("id")+'">'+tech.get("name")+'</option>';
                $(techField).append(_h);
            });
        }});

        var aciTreeAPI = $('#mo_tree').aciTree({
            ajax: {
                url: API_URL + '/api/managedobjects/tree/0',
                //url: API_URL + '/api/managedobjects/tree/cached',
                data:{
                    tech_pk: function(){ return $(that.$el).find('#bd_mobrowser_select_tech').val(); },
                    vendor_pk: function(){ return $(that.$el).find('#bd_mobrowser_select_vendor').val();}, 
                    search_term: function(){ return $(that.$el).find('#bd_mobrowser_tree_filter').val(); }
                }
            }
        });
        
        //Handle change event on vendor and technology select fields
        $('#bd_mobrowser_select_tech,#bd_mobrowser_select_vendor')
        .on('change', function () {
            $('#mo_tree').aciTree('api').unload(null, {
                success: function () {
                    $('#mo_tree').aciTree('api').ajaxLoad();
                }
            });
        });

    //Handle keyup event on filter search input field
        $('#bd_mobrowser_tree_filter').on('keyup', function () {
            $('#mo_tree').aciTree('api').unload(null, {
                success: function () {
                    $('#mo_tree').aciTree('api').ajaxLoad();
                }
            });
        });

        //Add context menu on MOs
        $('#mo_tree').contextMenu({
            selector: '.aciTreeLine',
            build: function (element) {
                var api = $('#mo_tree').aciTree('api');
                var item = api.itemFrom(element);
                var menu = {};
                var itemId = api.getId(item);
                var itemLabel = api.getLabel(item);

                //Load MO data
                menu[ itemId + '_load_mo'] = {
                    name: 'Load Managed Object',
                    icon: "Paste",
                    callback: function () {
                        that.loadBrowseMO(itemLabel, itemId);
                    }//eof:callback
                };

                return {
                    autoHide: true,
                    items: menu
                };
            }
        });//end of contextMenu
    },
    
    /**
     * Load managed object browser
     * 
     * @param String moName
     * @param integer moPk
     * 
     * @since 1.0.0
     * @returns void
     */
    loadBrowseMO: function(moName, moPk){
        var tabId = this.tabId + '_' + moPk;
        var that = this;
        
        //Load MO tab
        AppUI.I().Tabs().addTab({
            id: tabId,
            title: '<i class="fa fa-puzzle-piece"></i> ' + moName,
            content: AppUI.I().Loading('<h3>Loading ' + moName + '...</h3>')
        });
        AppUI.I().Tabs().show({id: tabId});
            
        $.ajax({
            url: API_URL + '/api/managedobjects/fields/' + moPk + '/',
            type: "GET",
            data: {},
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {
                
                //Load the html template for the mo datatable
                AppUI.I().Tabs().setContent({
                    id: tabId, 
                    content:  that.moTableTemplate({moName: moName})
                });

                var moDTId = 'mo_dt_' + moPk;
                
                //Construct tr for table header and footer
                var tr = '';
                var moFields = [];
                
                //Construct the tr data and also populate moFields
               _(data).each(function(field){
                   tr += '<th>'+field + '</th>';
                   
                   //Class to use for drop targets
                   var filterCls='drop-target-'+field+'-'+moDTId;
                   moFields.push({name:field, data: field , title: '<span onclick=" event.stopPropagation();" class="glyphicon glyphicon-filter  filter-icon '+filterCls+'"></span>'+field + '&nbsp;' });
                   
               });
               tr = '<tr>' + tr + '</tr>';
               
               //Build table
               var tableHtml = '<table id="'+moDTId+'" class="table table-striped table-bordered dataTable" width="100%">';
               tableHtml += '<thead>' + tr + '</thead>';
               tableHtml += '<tfoot>' + tr + '</tfoot>';
               tableHtml += '</table>';
               
               //Add html to tab content area
               $('#'+tabId + ' .mo-datatable').html(tableHtml);
               
                //Initiate datatable to display rules data
               var moDataTable = $('#' + moDTId).DataTable({
                    "renderer": "bootstrap",
                    "scrollX": true,
                    "scrollY": true,
                    //"autoWidth": false,
                    //"deferRender": true,
                    "pagingType": 'full_numbers', 
                    "processing": true,
                    "serverSide": true,
                     colReorder: true,
                    "ajax": {
                        "url": API_URL + '/api/managedobjects/dt/'+moPk+'/',
                        "type": "GET",
                        'contentType': 'application/json',
                        'data': function(d) {
				//return JSON.stringify(d);
			}
                    },
                    "columns": moFields,
                    "language": {
                        "zeroRecords": "No matching data found",
                        "emptyTable": "MO has no data."
                    },
                    "dom": 
                        "<'row'<'col-sm-9'l><'col-sm-3'f>>" +
                        "<'row'<'col-sm-12'tr>>" +
                        "<'row'<'col-sm-5'i><'col-sm-7'p>>", 
                    "initComplete": function(settings, json){


                        //Refresh button
                        $('#'+moDTId + '_wrapper .dataTables_length').append(' <span class="btn btn-default" title="Refresh"><i class="fa fa-refresh"></i></span>');
                        $('#'+moDTId + '_wrapper .dataTables_length .fa-refresh').click(function(){
                            moDataTable.api().ajax.reload();
                        });
                        
                        //Donwload button
                        $('#'+moDTId + '_wrapper .dataTables_length').append(' <span class="btn btn-default" title="Download"><i class="fa fa-download"></i></span>');
                        $('#'+moDTId + '_wrapper .dataTables_length .fa-download').click(function(){
                            //moDataTable.api().ajax.reload();
                        });
                         
                         
                         _.forEach(moFields, function(field, idx){
                             
                             var filterCls='drop-target-'+field.name+'-'+moDTId;
                             var filterId ='drop_target_'+field.name +'_'+moDTId;;
                              
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
                                var filterCls='drop-target-'+colName+'-'+moDTId;
                                //var filterId ='drop_target_'+colName +'_'+moDTId;;


                                moDataTable.api().column(colIdx).search($(this).val()).draw();
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
                         

 
                        
                    },
                    "headerCallback": function(thead, data, start, end, display){
                        
                        //Re-append the filter icon on every table redraw
//                        $(thead).find('th').each( function (idx) {
//                            var fClass=moDTId + '-column-filter-'+idx;
//                            var h = '<span class="glyphicon glyphicon-filter pull-right filter-icon '+fClass+'"></span>';
//                            $(this).addClass('filtering');
//                            $(this).append(h);
//                        });
                    }
                });//end
            },
            error: function(jqXHR,textStatus, errorThrown ){
                AppUI.I().Tabs().setContent({id: tabId, content: AppUI.I().Alerts().Error("Failed to load managed object! Check connection to server") });
            }
        });
    }


});
module.exports = MOBrowserView;