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
});
	
module.exports = NetworkManagementView;