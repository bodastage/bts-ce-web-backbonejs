'use strict';
/**
 * MO Browser Module
 * 
 * @version 1.0.0
 * @author Bodastage Solutions<info@bodastage.com>
 */
var dashboardTemplate = require('html-loader!../templates/mobrowser/dashboard.html');
var leftPaneTemplate = require('html-loader!../templates/mobrowser/left-pane.html');
const moduleIcon = require('../images/registry_editor_black_25.png');
const moduleIcon100 = require('../images/registry_editor_black_100.png');
var VendorsCollection = require('../collections/vendors_collection?window=window');

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
        
        AppUI.I().Tabs().addTab({
            id: this.tabId,
            title: '<img src="'+moduleIcon+'" width="16px" class="img-icon"/> MO Browser',
            content: AppUI.I().Loading('<h3>Loading MO Browser module...</h3>')
        });
        AppUI.I().Tabs().show({id: this.tabId});
        
        AppUI.I().Tabs().setContent({
            id: tabId,
            content: this.template()
        });
        
    },

    /**
     * Load left pane with tree browser
     * 
     * @since 1.0.0
     * 
     * @returns void
     */
    loadLeftPanel: function () {
        var that = this;
        
        AppUI.I().ModuleMenuBar().setTitle('<img src="'+moduleIcon100+'" width="32px" class="img-icon"/> MO Browser');
        AppUI.I().getLeftModuleArea().html(leftPaneTemplate);
        
        //Add vendors
        var vendorsCollection = new VendorsCollection();
        vendorsCollection.fetch({async:false});
         var vendorField = $(that.$el).find('#bd_mobrowser_select_vendor');
        _(vendorsCollection.models).each(function(vendor){
                var _h = '<option value="'+vendor.get("id")+'">'+vendor.get("name")+'</option>';
                $(vendorField).append(_h);
        });

    },


});
module.exports = MOBrowserView;