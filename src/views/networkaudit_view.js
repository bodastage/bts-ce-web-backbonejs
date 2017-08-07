'use strict';

const AppUI = require('../libs/app-ui');
var dashboardTmpl = require('raw-loader!../templates/networkaudit/dashboard.html');
var leftPanelTmpl = require('raw-loader!../templates/networkaudit/left-pane.html');

var NetworkAuditView = Backbone.View.extend({
    el: 'body',

    //tab Id for the network audit dashboard
    tabId: 'tab_networkaudit',
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
     * @returns void
     */
    initialize: function () {
        this.render();
    },

    /**
     * Load module dashboard
     *  
     * @returns void
     */
    loadDashboard: function () {
        AppUI.I().Tabs().addTab({
            id: this.tabId,
            title: '<img src="assets/images/discrepancy_black_100.png" width="16px" class="img-icon"/> Network Audit</b>',
            content: AppUI.I().Loading('<h3>Loading network audit module...</h3>')
        });
        AppUI.I().Tabs().show({id: this.tabId});
    },
    
    /**
     * Load left pane
     * 
     * @returns void
     */
    loadLeftPane: function(){
        var that = this;
        AppUI.I().ModuleMenuBar().setTitle( '<img src="assets/images/discrepancy_black_100.png" width="32px" class="img-icon"/> Network Audit	' );

        AppUI.I().getLeftModuleArea().html(leftPanelTmpl); 
    }
});

module.exports = NetworkAuditView;