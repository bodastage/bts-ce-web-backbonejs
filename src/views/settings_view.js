'use strict';

var dashboardTemplate =  require('html-loader!../templates/settings/dashboard.html');
var leftPaneTemplate = require('html-loader!../templates/settings/left-pane.html');
var SettingsCollection = require('../collections/settings_collection');

var SettingsView = Backbone.View.extend({
    el: 'body',

    //Template
    template: _.template(dashboardTemplate),

    tabId: 'tab_settings',
    
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
            title: '<i class="fa fa-cog"></i> Settings',
            content: AppUI.I().Loading('<h3>Loading settings module...</h3>')
        });
        AppUI.I().Tabs().show({id: tabId});
        
        AppUI.I().Tabs().setContent({
            id: tabId,
            content: this.template()
        });
        
        $('#'+tabId + ' .bd-notice').html(AppUI.I().Loading("Loading settings..."));
        
        var settingsCollection = new SettingsCollection();
        settingsCollection.url = settingsCollection.url + 'category/configuration_management';
        settingsCollection.fetch({
            success: function(collection, response, options){
                _(collection.models).each(function(_s){
                    var h  = '<tr><td>'+_s.get('label')+'</td><td>'+_s.get('value')+'</td><td><a href="#" data-id='+_s.get("id")+'><i class="fa fa-edit" title="Update setting"></a></i></td></tr>';
                    $('#'+tabId + ' #dt_settings tbody').append(h);
                });//eof:.each
                
                //Reset progress notice
                $('#'+tabId + ' .bd-notice').html('');
            },
            error: function(){
                $('#'+tabId + ' .bd-notice').html(AppUI.I().Alerts({close:true}).Error("Error occured!"));
            }
        });


    },
});
	
module.exports = SettingsView;