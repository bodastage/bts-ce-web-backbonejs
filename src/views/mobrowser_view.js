'use strict';
/**
 * MO Browser Module
 * 
 * @version 1.0.0
 * @author Bodastage Solutions<info@bodastage.com>
 */

var dashboardTemplate = require('html-loader!../templates/mobrowser/dashboard.html');
var leftPaneTemplate = require('html-loader!../templates/mobrowser/left-pane.html');

var MOBrowserView = Backbone.View.extend({
    el: 'body',

    //tab Id for the mobule dashboard
    tabId: 'tab_mobrowser',

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
            title: '<i class="fa fa-globe"></i> MO Browser',
            content: AppUI.I().Loading('<h3>Loading MO Browser module...</h3>')
        });
        AppUI.I().Tabs().show({id: this.tabId});
        
        AppUI.I().Tabs().setContent({
            id: tabId,
            content: this.template()
        });
        
    }

});
module.exports = MOBrowserView;