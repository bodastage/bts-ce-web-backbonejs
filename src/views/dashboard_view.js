'use strict';

import dashboardTemplate from 'raw-loader!../templates/dashboard/dashboard.html';

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
        //User left menu
        AppUI.I().ModuleMenuBar().setTitle('<span class="glyphicon glyphicon-home"></span> Dashboard');
        AppUI.I().getLeftModuleArea().html(_.template(sidePanelTempl));
    }
});
	