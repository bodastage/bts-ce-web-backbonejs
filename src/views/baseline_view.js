'use strict';

var dashboardTemplate =  require('html-loader!../templates/baseline/dashboard.html');
var leftPaneTemplate = require('html-loader!../templates/baseline/left-pane.html');

var BaselineView = Backbone.View.extend({
    el: 'body',

    //Template
    template: _.template(dashboardTemplate),

    tabId: 'tab_baseline',
    
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
     * @since 1.0.0
     * 
     * @return void
     */
    loadDashboard: function () {
        var tabId = this.tabId;
        var that = this;
        
        AppUI.I().Tabs().addTab({
            id: tabId,
            title: '<i class="fa fa-stop-circle-o"></i> Network Baseline',
            content: this.template()
        });
        AppUI.I().Tabs().show({id: tabId});
        
        that.loadBaseliveValues();
    },
    
    loadBaseliveValues: function(){
        var tabId = tabId;
        var that = this;
        
        //Initialize datatable
        $('#dt_baseline_values').DataTable({
            //"scrollX": true,
            //"scrollY": true,
            "pagingType": 'full_numbers',
            "processing": true,
            "serverSide": true,
            colReorder: true,
            "ajax": {
                "url": API_URL + '/api/networkbaseline/dt/',
                "type": "GET",
                'contentType': 'application/json',
                "error": function(jqXHR, textStatus, errorThrown ){
                }
            },
            "columns": [
                {name:"vendor", data: "vendor", title: "Vendor" },
                {name:"technology", data: "technology", title: "Technology" },
                {name:"mo", data: "mo", title: "Managed Object" },
                {name:"parameter", data: "parameter", title: "Parameter" },
                {name:"value", data: "value", title: "Value" },
                {name:"date_added", data: "date_added", title: "First Computation" },
                {name:"date_modified", data: "date_modified", title:  "Update Date" }
            ],
            "language": {
                "zeroRecords": "No matching data found",
                "emptyTable": "No network baseline data."
            },
            "dom":
                    "<'row'<'col-sm-9'l><'col-sm-3'f>>" +
                    "<'row'<'col-sm-12'tr>>" +
                    "<'row'<'col-sm-5'i><'col-sm-7'p>>",
            "initComplete": function () {

            }
        });//end
    }
});
	
module.exports = BaselineView;