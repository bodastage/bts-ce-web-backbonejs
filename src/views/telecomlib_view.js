/* 
 * Telecom Library
 * 
 * @version 1.0.0
 * @author Bodastage Engineering <dev@bodastage.com>
 */

var dashboardTmpl = require('raw-loader!../templates/telecomlib/dashboard.html');

var TelecomLibView = Backbone.View.extend({
   el: 'body',
   
   /**
    * Network inventory base tab
    */
   tabId: 'tab_inventory',
   
   /**
    * Render UI 
    * 
    * @returns void
    */
   render: function(){
        this.loadDashboard();
        AppUI.I().Tabs().setContent({
            id: this.tabId,
            content: dashboardTmpl
        });
   },
   
    /**
     * Initialize view
     * 
     * @version 1.0.0
     * @return void
     */
    initialize: function () {
        this.render();
    },
    
    /**
     * Load module dashboard
     *  
     * @version 1.0.0
     * @return void
     */
    loadDashboard: function () {
        AppUI.I().Tabs().addTab({
            id: this.tabId,
            title: '<i class="fa fa-bank"></i> Telecom Library</b>',
            content: AppUI.I().Loading('<h3>Loading telecom library module...</h3>')
        });
        AppUI.I().Tabs().show({id: this.tabId});
    },

});

module.exports = TelecomLibView;