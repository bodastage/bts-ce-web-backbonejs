'use strict';

var dashboardTemplate =  require('html-loader!../templates/dashboard/dashboard.html');
var leftPaneTemplate = require('html-loader!../templates/dashboard/left-pane.html');

var DashboardView = Backbone.View.extend({
    el: '#bd_tab_content > #dashboard_tab',

    //Template
    template: _.template(dashboardTemplate),

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

        this.$el.html(this.template());

        //Left side pane items
        AppUI.I().ModuleMenuBar().setTitle('<i class="fa fa-plug"></i> Modules');
        AppUI.I().getLeftModuleArea().html(_.template(leftPaneTemplate));
    }
});
	
module.exports = DashboardView;