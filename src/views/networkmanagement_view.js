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
        AppUI.I().ModuleMenuBar().setTitle('<i class="fa fa-sitemap"></i> Network Elements');
        AppUI.I().getLeftModuleArea().html(leftPaneTemplate);
        
        
        //Initialize live network tree
        var liveNetworkTree = $('#networktree_live').aciTree({
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
                    if(!isNaN(parseInt(this.getId(item)))){
                            settings.data['parentPk'] = this.getId(item);
                    }
                } 
                settings.url += (item ? this.getId(item) : '');
            }
        }); //eof:live_tree
    }
});
	
module.exports = NetworkManagementView;