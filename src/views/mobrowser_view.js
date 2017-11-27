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
const moduleIcon = require('../images/registry_editor_black_25.png');
const moduleIcon100 = require('../images/registry_editor_black_100.png');
var VendorsCollection = require('../collections/vendors_collection');
var TechCollection = require('../collections/technologies_collection');

var MOBrowserView = Backbone.View.extend({
    el: 'body',

    //tab Id for the mobule dashboard
    tabId: 'tab_mobrowser',

    //Template
    template: _.template(dashboardTemplate),
    moTableTemplate: _.template(moTemplate),
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
        this.loadLeftPanel();
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
            title: '<img src="'+moduleIcon+'" width="16px" class="img-icon"/> MO Browser',
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
        
        AppUI.I().ModuleMenuBar().setTitle('<img src="'+moduleIcon100+'" width="32px" class="img-icon"/> MO Browser');
        AppUI.I().getLeftModuleArea().html(leftPaneTemplate);
        
        //Add vendors
        var vendorsCollection = new VendorsCollection();
        vendorsCollection.fetch({async:false});
         var vendorField = $(that.$el).find('#bd_mobrowser_select_vendor');
        _(vendorsCollection.models).each(function(vendor){
                var _h = '<option value="'+vendor.get("id")+'">'+vendor.get("name")+'</option>';
                $(vendorField).append(_h);
        });
        
        //Add technolgoies
        var techCollection = new TechCollection();
        techCollection.fetch({async:false});
         var techField = $(that.$el).find('#bd_mobrowser_select_tech');
        _(techCollection.models).each(function(tech){
                var _h = '<option value="'+tech.get("id")+'">'+tech.get("name")+'</option>';
                $(techField).append(_h);
        });//eof:.each

        var aciTreeAPI = $('#mo_tree').aciTree({
            ajax: {
                url: API_URL + '/api/managedobjects/tree/0',
                data:{
                    techPk: function(){ return $(that.$el).find('#bd_mobrowser_select_tech').val(); },
                    vendorPk: function(){ return $(that.$el).find('#bd_mobrowser_select_vendor').val();}, 
                    searchTerm: function(){ return $(that.$el).find('#bd_mobrowser_tree_filter').val(); }
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
        });
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
            title: '<img src="' + moduleIcon + '" width="16px" class="img-icon"/> ' + moName,
            content: AppUI.I().Loading('<h3>Loading ' + moName + '...</h3>')
        });
        AppUI.I().Tabs().show({id: tabId});

        $.ajax({
            url: API_URL + '/api/managedobjects/mobrowser/columns/' + moPk,
            type: "GET",
            data: {},
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {
                
                //Load the html template for the mo datatable
                AppUI.I().Tabs().setContent({
                    id: tabId, 
                    content:  that.moTableTemplate({moName: moName})
                });

                
                //Construct tr for table header and footer
                var tr = '';
                var moFields = [];
                
                //Construct the tr data and also populate moFields
               _(data).each(function(field){
                   tr += '<th>'+field.name + '</th>';
                   moFields.push({name:field.name, data: field.name });
               });
               tr = '<tr>' + tr + '</tr>';
               
               var moDTId = 'mo_dt_' + moPk;
               
               //Build table
               var tableHtml = '<table id="'+moDTId+'" class="table table-striped table-bordered dataTable" width="100%">';
               tableHtml += '<thead>' + tr + '</thead>';
               tableHtml += '<tfoot>' + tr + '</tfoot>';
               tableHtml += '</table>';
               
               //Add html to tab content area
               $('#'+tabId + ' .mo-datatable').html(tableHtml);
               
                //Initiate datatable to display rules data
               var moDataTable = $('#' + moDTId).DataTable({
                    "scrollX": true,
                    //"scrollY": true,
                    "pagingType": 'full_numbers', 
                    "processing": true,
                    "serverSide": true,
                     colReorder: true,
                    "ajax": {
                        "url": API_URL + '/api/managedobjects/mobrowser/dt/'+moPk,
                        "type": "POST",
                        'contentType': 'application/json',
                        'data': function(d) {
				return JSON.stringify(d);
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
                    "initComplete": function(){
                        
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