'use strict';

var dashboardTemplate =  require('html-loader!../templates/networkmanagement/dashboard.html');
var leftPaneTemplate = require('html-loader!../templates/networkmanagement/left-pane.html');

var NetworkManagementView = Backbone.View.extend({
    el: 'body',

    //Template
    template: _.template(dashboardTemplate),

    tabId: 'tab_netmgt',
    
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
            id: tabId,
            title: '<i class="fa fa-sitemap"></i> Network Management',
            content: AppUI.I().Loading('<h3>Loading network management module...</h3>')
        });
        AppUI.I().Tabs().show({id: tabId});
        
        AppUI.I().Tabs().setContent({
            id: tabId,
            content: this.template()
        });
    },
    
    /**
     * Load newtork tree 
     * 
     * @returns void
     */
    loadLeftPanel: function(){
        var that = this;
        AppUI.I().ModuleMenuBar().setTitle('<i class="fa fa-sitemap"></i> Network Browser');
        AppUI.I().getLeftModuleArea().html(leftPaneTemplate);
        
        //Initialize live network tree
        var liveNetworkTree = $('#live_newtork_tree').aciTree({
            ajax: {
                url: API_URL + "/api/network/tree/",
                data: { 
                        source: "live" //live network
                }
            },
            ajaxHook: function(item,settings){
                if(item !== null){
                    var properties = this.itemData(item);
                    settings.data['nodeType'] = properties['_nodeType'];
                    settings.data['elementId'] = properties['_elementId'];
                    settings.data['parentPk']  = properties['_elementId'];
                } 
                settings.url += (item ? this.getId(item) : '');
            }
        }); //eof:live_tree
        
        
        //Add context menu
        that.loadContextMenu();
    },
    
    loadContextMenu: function(){

        //Add context menu on MOs
        $('#live_newtork_tree').contextMenu({
            selector: '.aciTreeLine',
            build: function (element) {
                var api = $('#live_newtork_tree').aciTree('api');
                var item = api.itemFrom(element);
                var properties = api.itemData(item);
                var menu = {};
                var itemId = api.getId(item);
                var itemLabel = api.getLabel(item);
                
                
                //MSC Root node
                if(itemId == 'msc_root'){
                    //Load table of mscs and their parameters
                    menu[ itemId + '_load_all_mscs'] = {
                        name: 'View all parameters',
                        icon: "Paste",
                        callback: function () {
                           
                        }//eof:callback
                    };
                }
                
                //Individual MSC details
                //itemId starts with msc_ and nodeTyle is msc
                if( itemId.substr(0,3) == 'msc' && properties['_nodeType'] === 'msc' ){

                    menu[ itemId + '_load_all_mscs'] = {
                        name: 'View MSC details',
                        icon: "Paste",
                        callback: function () {
                           
                        }//eof:callback
                    };
                }
                
                //BSC Root node
                if(itemId == 'bsc_root'){
                    //Load table of mscs and their parameters
                    menu[ itemId + '_load_parameters'] = {
                        name: 'View all BSC parameters',
                        icon: "Paste",
                        callback: function () {
                           
                        }//eof:callback
                    };
                }
                
                //Individual BSC details
                //itemId starts with bsc_ and nodeTyle is bsc
                if( itemId.substr(0,3) == 'bsc' && properties['_nodeType'] === 'bsc' ){

                    menu[ itemId + '_load_parameters'] = {
                        name: 'View BSC details',
                        icon: "Paste",
                        callback: function () {
                           
                        }//eof:callback
                    };
                }
                
                return {
                    autoHide: true,
                    items: menu
                };
            }
        });//end of contextMenu
    }
});
	
module.exports = NetworkManagementView;