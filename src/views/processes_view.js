'use strict';

var dashboardTemplate =  require('html-loader!../templates/processes/dashboard.html');
var leftPaneTemplate = require('html-loader!../templates/processes/left-pane.html');

var ProcessesView = Backbone.View.extend({
    el: 'body',

    //Template
    template: _.template(dashboardTemplate),

    tabId: 'tab_processes',
    
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
        var that = this;
        
        AppUI.I().Tabs().addTab({
            id: tabId,
            title: '<i class="fa fa-cogs"></i> Processes',
            content: AppUI.I().Loading('<h3>Loading processes module...</h3>')
        });
        AppUI.I().Tabs().show({id: tabId});
        
        AppUI.I().Tabs().setContent({
            id: tabId,
            content: this.template()
        });
    },
    
    loadLeftPanel: function(){
        //User left menu
        AppUI.I().ModuleMenuBar().setTitle('<i class="fa fa-cogs"></i> Processes');
        AppUI.I().getLeftModuleArea().html(_.template(leftPaneTemplate));
    }
});
	
module.exports = ProcessesView;