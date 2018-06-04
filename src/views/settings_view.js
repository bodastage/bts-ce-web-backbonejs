'use strict';

var dashboardTemplate =  require('html-loader!../templates/settings/dashboard.html');
var leftPaneTemplate = require('html-loader!../templates/settings/left-pane.html');
var SettingsCollection = require('../collections/settings_collection');
var CMMenuTmpl = require('html-loader!../templates/settings/cm-settings-options.html');
var CMScheduleTmpl = require('html-loader!../templates/settings/cm-settings-schedule.html');
var CMFileFetchTmpl = require('html-loader!../templates/settings/cm-settings-file-fetch.html');
var CMFileFormatsTmpl = require('html-loader!../templates/settings/cm-settings-file-formats.html');
var SupportedVendorsTechTmpl = require('html-loader!../templates/settings/nw-supported-vendors-techs.html');

var VendorsCollection = require('../collections/vendors_collection');
var VendorsTechCollection = require('../collections/vendors_tech_collection');
var TechCollection = require('../collections/technologies_collection');

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
        "click .show-cm-file-formats": "showCMFileFormats",
        "click .show-supported-vendors-techs": "showSupportedVendorTechs",
        "click .run-cm-etlp": "runCMETLP"
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
    
    /**
     * Save CM ETL Schedule
     * 
     * @version 1.0.0
     * @since 1.0.0
     */
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
     * Show file fetch settings
     * 
     * @version 1.0.0
     * @since 1.0.0
     */
    showFileFetch: function(){
        var that = this;
        var tabId = this.tabId + "_cm_file_fetch";
        AppUI.I().Tabs().addTab({
            id: tabId,
            title: '<i class="fa fa-cog"></i> CM File Directories',
            content: (_.template(CMFileFetchTmpl))()
        });
    },
    
    /**
     * Show file format settings
     * 
     * @version 1.0.0
     * @since 1.0.0
     */
    showCMFileFormats: function(){
        var that = this;
        var tabId = this.tabId + "_cm_file_formats";
        AppUI.I().Tabs().addTab({
            id: tabId,
            title: '<i class="fa fa-cog"></i> CM Raw File Directories',
            content: (_.template(CMFileFormatsTmpl))()
        });
        
        var tableDTId = 'cm_file_formats_dt';
        
        var cmFileFormatsDT = $('#'+tableDTId).DataTable({
             //"scrollX": true,
             //"scrollY": true,
             "pagingType": 'full_numbers',  
             "processing": true,
             "serverSide": true,
              colReorder: true,
             "ajax": {
                 "url": API_URL + '/api/settings/cm/vendor_format_map/dt',
                 "type": "GET",
                 'contentType': 'application/json',
             },
             "columns": [
                 {name:'vendor', data: "vendor" , title: "Vendor"},
                 {name:'technology', data: "technology" , title: "Technology"},
                 {name:'label', data: "label" , title: "Format"},
                 {name:'pk', data: "pk" , title: "&nbsp"},
             ],
            "columnDefs": [
                  {
                        "render": function ( data, type, row ) {
                            return  '<a href="#" class="delete-cm-file-format" data-pk="'+data+'"><i class="fa fa-minus-circle text-danger "></i></a>';
                        },
                        "targets": 3
                  }
              ],
             "language": {
                 "zeroRecords": "No matching data found",
                 "emptyTable": "There is no data."
             },
             "dom": 
                 "<'row'<'col-sm-9'l><'col-sm-3'f>>" +
                 "<'row'<'col-sm-12'tr>>" +
                 "<'row'<'col-sm-5'i><'col-sm-7'p>>", 
             "initComplete": function(){
                 //Refresh button
                 $('#'+tableDTId + '_wrapper .dataTables_length').append(' <span class="btn btn-default" title="Refresh"><i class="fa fa-refresh"></i></span>');
                 $('#'+tableDTId + '_wrapper .dataTables_length .fa-refresh').click(function(){
                     cmFileFormatsDT.api().ajax.reload();
                 });

             }
         });//end
                
                
          //Populate supported vendor technology map 
        //Add vendors
        var vendorsTechCollection = new VendorsTechCollection();
        //vendorsCollection.fetch({async:false});
        var vendorTechField = $(that.$el).find('#cm_file_formats_form [name=vendor_technology_map]');
        vendorTechField.html('<option value="0">--Select vendor technology--</option>');
        vendorsTechCollection.fetch({success: function(collection,response,options){
            _(collection.models).each(function(vendorTech){
                //@TODO: Fix the returned value from the api call
                var vendorTechLabel = vendorTech.get("vendor") + '-' + vendorTech.get("technology");
                var _h = '<option value="'+vendorTech.get("pk")+'">'+ vendorTechLabel +'</option>';
                $(vendorTechField).append(_h);
            });
        }});
        
        //Add formats for specific vendor and technology map 
        var cmFileFormatField = $(that.$el).find('#cm_file_formats_form [name=vendor_tech_cm_formats]');
        $(vendorTechField).change(function(){

            var vendor_tech_id = $(this).val();
            
            
            $.ajax({
                "url": API_URL + '/api/settings/cm/vendor_format_map',
                "type": 'GET',
                "data": {vendor_tech_id: vendor_tech_id },
                "success": function(data, xhr, response){
                    cmFileFormatField.html('<option value="0">--Select CM file format--</option>');
                   _(data).each(function(cm_format){
                        var _h = '<option value="'+cm_format.pk+'">'+ cm_format.label +'</option>';
                        cmFileFormatField.append(_h);
                   });

                },
                "error": function(xhr, error){
                    
                }
                        
            });
        });
    
        //Add format 
        //Submit vendor and tech
        $('#' + tabId ).find('#cm_file_formats_form [type=submit]').click(function(){

            $('#' + tabId).find('.bd-notice').html(
                    AppUI.I().Loading("Adding format...")
            );

            var formatId = $(cmFileFormatField).val();
            var vendorTechId = $(vendorTechField).val();
            
            if(formatId == 0 || vendorTechId == 0 ){
               $('#' + tabId).find('.bd-notice').html(AppUI.I()
                       .Alerts({close:true})
                       .Error('Select a format and vendor/technology')
                    );
            }else{
                $.ajax({
                    "url": API_URL + '/api/settings/cm/vendor_format_map',
                    "type": "POST",
                    'dataFormat': 'json',
                    'data': JSON.stringify({vendor_tech_id: vendorTechId, format_id: formatId}),
                    'contentType': 'application/json',
                    "success": function(data, xhr, status){
                        if(data.status == 'success'){
                            $('#' + tabId).find('.bd-notice').html(AppUI.I()
                                .Alerts({close:true})
                                .Success('Format added')
                            );
                            cmFileFormatsDT.api().ajax.reload();
                        }else{
                            $('#' + tabId).find('.bd-notice').html(AppUI.I()
                                .Alerts({close:true})
                                .Error('Failed to add format. ' + data.message)
                            );
                        }
                    },
                    "error": function(){
                        $('#' + tabId).find('.bd-notice').html(AppUI.I()
                           .Alerts({close:true})
                           .Error('Failed to add format')
                        );
                    }
                });
            }
            
            return false;
        });
        
        //Delete vendor and technology map 
        $('#' + tabId ).on('click','#cm_file_formats_dt .delete-cm-file-format',function(event){

            $('#' + tabId).find('.bd-notice').html(
                AppUI.I().Loading("Deleting vendor file format...")
            );
        
            var format_id = $(this).data("pk");

            $.ajax({
                "url": API_URL + '/api/settings/cm/vendor_format_map/' + format_id,
                "type": "DELETE",
                'dataFormat': 'json',
                "success": function(data, xhr){
                    if(data.status === 'success'){
                        $('#' + tabId).find('.bd-notice').html(AppUI.I()
                            .Alerts({close:true})
                            .Success('File format deleted')
                        );
                        cmFileFormatsDT.api().ajax.reload();
                    }else{
                        $('#' + tabId).find('.bd-notice').html(AppUI.I()
                            .Alerts({close:true})
                            .Error('Failed to delete file format')
                        );        
                    }
                },
                "error": function(){
                    $('#' + tabId).find('.bd-notice').html(AppUI.I()
                        .Alerts({close:true})
                        .Error('Failed to delete file format')
                    );                 
                }
            });
        
            //$( this ).off( event );
        });
    },
    
    
    
    /**
     * Show supported vendors and technologies
     * 
     * @version 1.0.0
     * @since 1.0.0
     */
    showSupportedVendorTechs: function(){
        var that = this;
        var tabId = that.tabId + "_supported_vendors_techs";
        AppUI.I().Tabs().addTab({
            id: tabId,
            title: '<i class="fa fa-cog"></i> Supported Vendors and Technologies',
            content: (_.template(SupportedVendorsTechTmpl))()
        });
        
        
       var tableDTId = 'nw_supported_vendors_techs_dt';
        
        var jqDT = $('#'+tableDTId).DataTable({
             //"scrollX": true,
             //"scrollY": true,
             "pagingType": 'full_numbers',  
             "processing": true,
             "serverSide": true,
             // colReorder: true,
             "ajax": {
                 "url": API_URL + '/api/settings/network/technologies/dt',
                 "type": "GET",
                 'contentType': 'application/json',
             },
             "columns": [
                 {name:'vendor', data: "vendor" , title: "Vendor"},
                 {name:'technology', data: "technology" , title: "Technology"},
                 {name:'pk', data: "pk" , title: "&nbsp;"},
             ],
              "columnDefs": [
                  {
                        "render": function ( data, type, row ) {
                            return  '<a href="#" class="delete-vendor-tech" data-pk="'+data+'"><i class="fa fa-minus-circle text-danger "></i></a>';
                        },
                        "targets": 2
                  }
              ],
             "language": {
                 "zeroRecords": "No matching data found",
                 "emptyTable": "There is no data."
             },
             "dom": 
                 "<'row'<'col-sm-9'l><'col-sm-3'f>>" +
                 "<'row'<'col-sm-12'tr>>" +
                 "<'row'<'col-sm-5'i><'col-sm-7'p>>", 
             "initComplete": function(){
                 //Refresh button
                 $('#'+tableDTId + '_wrapper .dataTables_length').append(' <span class="btn btn-default" title="Refresh"><i class="fa fa-refresh"></i></span>');
                 $('#'+tableDTId + '_wrapper .dataTables_length .fa-refresh').click(function(){
                     jqDT.api().ajax.reload();
                 });

 
             }
         });//end
         
         
         //Load vendor and technology forms
        //Add vendors
        var vendorsCollection = new VendorsCollection();
        //vendorsCollection.fetch({async:false});
        var vendorField = $(that.$el).find('#nw_supported_vendors_techs_form [name=vendor]');
        vendorField.html('<option value="0">--Select vendor--</option>');
        vendorsCollection.fetch({success: function(collection,response,options){
            _(collection.models).each(function(vendor){
                    var _h = '<option value="'+vendor.get("id")+'">'+vendor.get("name")+'</option>';
                    $(vendorField).append(_h);
            });
        }});
        
        //Add technolgoies
        var techCollection = new TechCollection();
        var techField = $(that.$el).find('#nw_supported_vendors_techs_form [name=technology]');
        techField.html('<option value="0">--Select technology--</option>');
        techCollection.fetch({success: function(collection,response,options){
            _(collection.models).each(function(tech){
                
                //Only consider 2G,3G,4G,and 5G
                if ( tech.get("id") > 4 ) return;
                
                var _h = '<option value="'+tech.get("id")+'">'+tech.get("name")+'</option>';
                $(techField).append(_h);
            });
        }});
         
        //Submit vendor and tech
        $('#' + tabId ).find('#nw_supported_vendors_techs_form [type=submit]').click(function(){

            $('#' + tabId).find('.bd-notice').html(
                    AppUI.I().Loading("Adding vendor and technology map...")
            );

            var tech_pk = $(techField).val();
            var vendor_pk = $(vendorField).val();
            
            if(tech_pk == 0 || vendor_pk == 0 ){
               $('#' + tabId).find('.bd-notice').html(AppUI.I()
                       .Alerts({close:true})
                       .Error('Select a technology and vendor')
                    );
            }else{
                $.ajax({
                    "url": API_URL + '/api/settings/network/technologies',
                    "type": "POST",
                    'dataFormat': 'json',
                    'data': JSON.stringify({vendor_pk: vendor_pk, tech_pk: tech_pk}),
                    'contentType': 'application/json',
                    "success": function(data, xhr, status){
                        if(data.status == 'success'){
                            $('#' + tabId).find('.bd-notice').html(AppUI.I()
                                .Alerts({close:true})
                                .Success('Vendor and technology map added')
                            );
                            jqDT.api().ajax.reload();
                        }else{
                            $('#' + tabId).find('.bd-notice').html(AppUI.I()
                                .Alerts({close:true})
                                .Error('Failed to add vendor and technology map')
                            );
                        }
                    },
                    "error": function(){
                        $('#' + tabId).find('.bd-notice').html(AppUI.I()
                           .Alerts({close:true})
                           .Error('Failed to add vendor and technology map')
                        );
                    }
                });
            }
            
               //Delete vendor and technology map 
                //Submit vendor and tech
                $('#' + tabId ).on('click','#nw_supported_vendors_techs_dt .delete-vendor-tech',function(){

                    $('#' + tabId).find('.bd-notice').html(
                        AppUI.I().Loading("Deleting vendor and technology map...")
                    );

                    var map_id = $(this).data("pk");

                    console.log('map:' + map_id);

                    $.ajax({
                        "url": API_URL + '/api/settings/network/technologies/' + map_id,
                        "type": "DELETE",
                        'dataFormat': 'json',
                        "success": function(data, xhr){
                            if(data.status === 'success'){
                                $('#' + tabId).find('.bd-notice').html(AppUI.I()
                                    .Alerts({close:true})
                                    .Success('Vendor and technology map deleted')
                                );
                                jqDT.api().ajax.reload();
                            }else{
                                $('#' + tabId).find('.bd-notice').html(AppUI.I()
                                    .Alerts({close:true})
                                    .Error('Failed to delete vendor and technology map')
                                );        
                            }
                        },
                        "error": function(){
                            $('#' + tabId).find('.bd-notice').html(AppUI.I()
                                .Alerts({close:true})
                                .Error('Failed to delete vendor and technology map')
                            );                 
                        }
                    })
                });
                //end of delete

            
        });
        
    },
    
    /**
     * Trigger CM ETL processes
     * 
     * @returns {undefined}
     */
    runCMETLP: function(){
       var tabId = this.tabId + "_cm_schedule";
       
       $('#' + tabId).find('.bd-notice').html(AppUI.I().Loading('Starting Configuratiom management processes...'));
       
       $.ajax({
           "url": window.API_URL + '/api/settings/cm/run',
           "type": "GET",
           "success": function(data, xjhr, status){
                $('#' + tabId).find('.bd-notice').html(AppUI.I()
                    .Alerts({close:true})
                    .Success("Configuratiom management processes started. Go to Processes > Airflow > cm_etlp to monitor progress ")
                );    
           },
           error: function(){
                $('#' + tabId).find('.bd-notice').html(AppUI.I()
                    .Alerts({close:true})
                    .Error("Error occured. Trying again or log support request.")
                );    
           }
           
       }); 
    }

});
	
module.exports = SettingsView;