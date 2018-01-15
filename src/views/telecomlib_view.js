/* 
 * Telecom Library
 * 
 * @version 1.0.0
 * @author Bodastage Engineering <dev@bodastage.com>
 */

var dashboardTmpl = require('raw-loader!../templates/telecomlib/dashboard.html');
var vendorsTmpl = require('raw-loader!../templates/telecomlib/vendors.html');

var TelecomLibView = Backbone.View.extend({
   el: 'body',
   
   /**
    * Network inventory base tab
    */
   tabId: 'tab_inventory',
   
   events: {
       "click .load-vendors": "loadVendors"
   },
   
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

    /**
     * Load vendors
     */
    loadVendors: function(){
        var tabId = this.tabId + '_vendors';
        
        AppUI.I().Tabs().addTab({
            id: tabId,
            title: '<i class="fa fa-bank"></i> Vendors</b>',
            content: vendorsTmpl //AppUI.I().Loading('<h3>Loading vendors...</h3>')
        });
        AppUI.I().Tabs().show({id: tabId});
        
        $.ajax({
            url: API_URL + '/api/vendors',
            type: "GET",
            dataFormat: "json",
            "success": function(data, textStatus, jqXHR ){
                var h = '';
                $.each(data, function(idx, vendor){
                    h += '<tr><td>'+vendor.name+'</td><td><i class="fa fa-check-circle-o success alert-success"></i></td></tr>';
                })
                
                $('#dt_vendors tbody').html(h);
            },
            "error": function(jqXHR, textStatus, errorThrown ){
                try{
                var response = JSON.parse(jqXHR.responseText);
                    $('#'+tabId + ' .bd-notice').html(AppUI.I().Alerts({close:true}).Error(response.message))
                }catch(e){
                    $('#'+tabId + ' .bd-notice').html(AppUI.I().Alerts({close:true}).Error("Error occured!"))
                }
            }
        });
    }
});

module.exports = TelecomLibView;