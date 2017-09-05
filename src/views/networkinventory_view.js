/* 
 * Network Inventory
 * 
 * @version 1.0.0
 * @author Bodastage Solutions
 */

var dashboardTmpl = require('raw-loader!../templates/networkinventory/dashboard.html');

var NetworkInventoryView = Backbone.View.extend({
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
            title: '<img src="assets/images/discrepancy_black_100.png" \
                width="16px" class="img-icon"/> Network Inventory</b>',
            content: AppUI.I().Loading('<h3>Loading network inventory module...</h3>')
        });
        AppUI.I().Tabs().show({id: this.tabId});
    },

});

module.exports = NetworkInventoryView;