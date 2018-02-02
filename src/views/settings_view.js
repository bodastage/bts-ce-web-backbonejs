'use strict';

var dashboardTemplate =  require('html-loader!../templates/settings/dashboard.html');
var leftPaneTemplate = require('html-loader!../templates/settings/left-pane.html');
var SettingsCollection = require('../collections/settings_collection');
var CMMenuTmpl = require('html-loader!../templates/settings/cm-settings-options.html');
var CMScheduleTmpl = require('html-loader!../templates/settings/cm-settings-schedule.html');
var CMFileFetchTmpl = require('html-loader!../templates/settings/cm-settings-file-fetch.html');

var SettingsView = Backbone.View.extend({
    el: 'body',

    //Template
    template: _.template(dashboardTemplate),

    tabId: 'tab_settings',
    
    events: {
        "click .launch-cm-menu": "showCMSettingsMenu",
        "click .show-cm-schedule": "showCMSchedule",
        "click .save-cm-schedule": "saveCMSchedule",
        "click .show-cm-file-fetch": "showFileFetch",
    },
    
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
            content: this.template()
        });
        AppUI.I().Tabs().show({id: tabId});

        /**
        $('#'+tabId + ' .bd-notice').html(AppUI.I().Loading("Loading settings..."));
        
        var settingsCollection = new SettingsCollection();
        settingsCollection.url = window.API_URL + '/api/settings/category/configuration_management';
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
        **/

    },
    
    showCMSettingsMenu: function(){
        AppUI.I().ModuleMenuBar().setTitle('<i class="fa fa-cog"></i> Configuration Management');
        AppUI.I().getLeftModuleArea().html(_.template(CMMenuTmpl));
    },
    
    /**
     * Show CM schedule
     */
    showCMSchedule: function(){
        require('fuelux/dist/css/fuelux.min.css');
        var fueluxScheduler = require('fuelux/js/scheduler');
        
        var that = this;
        var tabId = this.tabId + "_cm_schedule";
        AppUI.I().Tabs().addTab({
            id: tabId,
            title: '<i class="fa fa-hourglass"></i> CM ETL Scheduling',
            content: (_.template(CMScheduleTmpl))()
        });
        
        $('#' + tabId + ' .bd-notice').html(AppUI.I().Loading('Initialising...'));
        
        //Get default
        $.ajax({
            "url": window.API_URL + '/api/settings/2',
            "type": "GET",
            "dataType": "json",
            "contentType": 'application/json',
            "success": function(data){
                var initialValue = JSON.parse(data.value);
                
                $('#cmScheduler').scheduler();
                $('#cmScheduler').scheduler('value',initialValue.scheduleValue);
                
                AppUI.I().Tabs().show({id: tabId});
                 
                $('#' + tabId + ' .bd-notice').html("");
            }
        });
        
        
        
       
        
        //Handle change event
        //$('#cmScheduler').on('changed.fu.scheduler', function () {
        //});
    },
    
    saveCMSchedule: function(){
        var that = this;
        var tabId = this.tabId + "_cm_schedule";
        
        $('#' + tabId + ' .bd-notice').html(AppUI.I().Loading('Updating schedule...'));
        
          var scheduleValue = $('#cmScheduler').scheduler('value');
          console.log(scheduleValue);
          
          var scheduleInterval = "0 0 * * *";
          
          var recurrencePatterns = scheduleValue.recurrencePattern.split(";");
          
          for(var i=0; i < recurrencePatterns.length; i++){
              var rp = recurrencePatterns[i].split("=");
              
              if(rp[0] === 'FREQ'){
                if( rp[1] === 'HOURLY'){
                    scheduleInterval = "0 * * * *";
                }
                if( rp[1] === 'DAILY'){
                    scheduleInterval = "0 0 * * *";
                }
                if( rp[1] === 'WEEKLY'){
                    scheduleInterval = "0 0 * * 0";
                }
                if( rp[1] === 'MONTHLY'){
                    scheduleInterval = "0 0 1 * *";
                }
                if( rp[1] === 'YEARLY'){
                    scheduleInterval = "0 0 1 1 *";
                }
              }

          }
          
          $.ajax({
              "url": API_URL + '/api/settings/1',
              "type": "POST",
              "dataType": "json",
              contentType: 'application/json',
              "data": JSON.stringify({
                    'data_type': 'string',
                    'name': 'cm_dag_schedule_interval',
                    'value': scheduleInterval }),
                "success": function(data){
                  
                  //Update start date
                    $.ajax({
                        "url": API_URL + '/api/settings/2',
                        "type": "POST",
                        "dataType": "json",
                        contentType: 'application/json',
                        "data": JSON.stringify({
                            'data_type': 'text',
                            'name': 'cm_dag_fuelux_scheduler_value',
                            'value': JSON.stringify({scheduleValue}) 
                        }),
                        "success": function(data){
                            $('#' + tabId + ' .bd-notice').html(AppUI.I().Alerts({close:true}).Success("Schedule updated"));
                        }
                    });
                  

              }
          });
    },
    
    /**
     * 
     * Show file fetch settings
     */
    showFileFetch: function(){
        var that = this;
        var tabId = this.tabId + "_cm_file_fetch";
        AppUI.I().Tabs().addTab({
            id: tabId,
            title: '<i class="fa fa-cog"></i> CM File Fetch',
            content: (_.template(CMFileFetchTmpl))()
        });
    }
});
	
module.exports = SettingsView;