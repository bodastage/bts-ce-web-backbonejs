'use strict';

var dashboardTemplate =  require('html-loader!../templates/profile/dashboard.html');
var leftPaneTemplate = require('html-loader!../templates/profile/left-pane.html');
var UserModel = require('../models/user_model');

var ProfileView = Backbone.View.extend({
    el: 'body',

    //Template
    template: _.template(dashboardTemplate),

    tabId: 'tab_profile',
    
    /**
     * Reloading the module.
     * 
     * @since 1.0.0
     * @version 1.0.0
     */
    reload: function () {
        this.render();
    },
    
    /**
     * Render view
     * 
     * @returns void
     */
    render: function () {
        this.loadDashboard();
    },
    
    /**
     * Load module dashboard
     *  
     * @version 1.0.0
     * @returns void
     */
    loadDashboard: function () {
        var tabId = this.tabId;
        var that = this;
        
        AppUI.I().Tabs().addTab({
            id: tabId,
            title: '<span class="glyphicon glyphicon-user"></span> Profile',
            content: this.template()
        });
        AppUI.I().Tabs().show({id: tabId});
        
        //
        $('#' + tabId + ' .bd-notice').html( AppUI.I().Loading('Loading user details...'));
        
         var userModel = new UserModel({id: localStorage.getItem('id')});
         userModel.fetch({
             success: function(model, response, options){
                 $('#' + tabId + ' form [name=email]').val(model.get("username"));
                 $('#' + tabId + ' form [name=firstname]').val(model.get("first_name"));
                 $('#' + tabId + ' form [name=lastname]').val(model.get("last_name"));
                 $('#' + tabId + ' form [name=othernames]').val(model.get("other_names"));
                 $('#' + tabId + ' form [name=jobtitle]').val(model.get("job_title"));
                 $('#' + tabId + ' form [name=phonenumber]').val(model.get("phone_number"));
                 $('#' + tabId + ' form [name=token]').val(model.get("token"));
                 
                 $('#' + tabId + ' .bd-notice').html("");
             },
             error: function(){
                 $('#' + tabId + ' .bd-notice').html(AppUI.I().Alerts({close:true}).Error('Error occured'));
             }
        });
    },
});
	
module.exports = ProfileView;