'use strict';

var dashboardTemplate =  require('html-loader!../templates/baseline/dashboard.html');
var leftPaneTemplate = require('html-loader!../templates/baseline/left-pane.html');

var BaselineView = Backbone.View.extend({
    el: 'body',

    //Template
    template: _.template(dashboardTemplate),

    tabId: 'tab_baseline',
    
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
        var that = this;
        
        AppUI.I().Tabs().addTab({
            id: tabId,
            title: '<i class="fa fa-stop-circle-o"></i> Network Baseline',
            content: AppUI.I().Loading('<h3>Loading baseline module...</h3>')
        });
        AppUI.I().Tabs().show({id: tabId});
        
        AppUI.I().Tabs().setContent({
            id: tabId,
            content: this.template()
        });
    },
});
	
module.exports = BaselineView;