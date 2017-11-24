'use strict';
/**
 * GIS Module
 * 
 * @version 1.0.0
 * @author Bodastage Solutions<info@bodastage.com>
 */

var dashboardTemplate = require('html-loader!../templates/gis/dashboard.html');
var leftPaneTemplate = require('html-loader!../templates/dashboard/left-pane.html');

var GISView = Backbone.View.extend({
    el: 'body',

    //tab Id for the network audit dashboard
    tabId: 'tab_gis',

    //Template
    template: _.template(dashboardTemplate),
    
    /**
     * Install of map
     */
    map : null, 
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

/**
        //Left side pane items
        AppUI.I().ModuleMenuBar().setTitle('<i class="fa fa-globe"></i> GIS');
        AppUI.I().getLeftModuleArea().html(_.template(leftPaneTemplate));
        **/
        //Render map
        /**
        var map = L.map('network_map').setView([51.505, -0.09], 13);

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([51.5, -0.09]).addTo(map)
            .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
            .openPopup();
            **/
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
            title: '<i class="fa fa-globe"></i> GIS Tools',
            content: AppUI.I().Loading('<h3>Loading GIS Tools module...</h3>')
        });
        AppUI.I().Tabs().show({id: this.tabId});
        
        AppUI.I().Tabs().setContent({
            'id': this.tabId,
            'content': dashboardTemplate
        });
        
        $('#'+tabId+ ' .bd-notice').html(AppUI.I().Loading('Loading map...'));

        $('#network_map').height($(window).height());
        
        //Load map
        this.map = L.map('network_map');
        
        //Clear loading indicator on load
        this.map.on('load',function(){
            $('.bd-notice').html('');
        });
        
        this.map.setView([-22.970722, -43.182365], 13);

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);


        //Add semi circle
        //South - 180 degrees
        L.semiCircle([-22.970722, -43.182365], {radius: 500, color: '#f03',})
	.setDirection(180, 45)
	.addTo(this.map);

        //Add semi circle
        //East - 90 degrees
        L.semiCircle([-22.970722, -43.182365], {radius: 500, color: '#ff0'})
	.setDirection(90, 45)
	.addTo(this.map);

        L.semiCircle([-22.970722, -43.182365], {
            radius: 500,
                startAngle: 0,
                stopAngle: 35
        }).addTo(this.map);

        //Another cell
    var heat = L.heatLayer([
	[50.5, 30.5, 0.2], // lat, lng, intensity
        [-22.970722, -43.182365, "571"]
    ], {radius: 25}).addTo(this.map);
        //$(window).on("resize", function () { $("#map").height($(window).height()); map.invalidateSize(); }).trigger("resize");
    }

});
module.exports = GISView;