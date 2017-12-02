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
    nbrLayer: null,
    
    /**
     * Carrier color map
     */
    freqColorMap: {
        "4154": "#FF5733",
        "9837": "#FFC300",
        "9882": "#33FF57",
        "9763": "#0000FF"
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
        var that = this;
        
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
        this.map = L.map('network_map', {
            fullscreenControl: true,
            fullscreenControlOptions: {
                position: 'topleft'
            }
        });
        //this.nbrLayer = new L.Control.Layers().addTo(this.map);
        
        //Clear loading indicator on load
        this.map.on('load',function(){
            $('.bd-notice').html('');
        });
        
        //Add ruler to measure distance
        L.control.ruler({'position':'topleft'}).addTo(this.map);
        
        /**
        //Add carrier color map 
        var carrierColorMapControl = L.control({
            position: 'topleft'
        });
        carrierColorMapControl.onAdd = function(map){
            var div = L.DomUtil.create('div', 'bd_carrier_color_map');
            div.innerHTML += 'Carrier Scale here';
            return div;
        };
        carrierColorMapControl.addTo(this.map);
        **/
        
        var latitude = -21.726113;
        var longitude= -48.1025004;
        
        this.map.setView([latitude, longitude], 13);

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
        
        $('#'+tabId + ' .bd-notice').html( AppUI.I().Loading('Loading cells...') + '<br />');
        that.fetchCells(1,100, true);


        //Add weather
//        var owmLayer = 'temp_new'; //wind_new'; //pressure_new'; //precipitation_new'; //clouds_new';
//        L.tileLayer('http://tile.openweathermap.org/map/' + owmLayer + '/{z}/{x}/{y}.png?appid=dda1d81056528b36f336ce401a3b7cbd', {
//            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//        }).addTo(this.map);


    },
    
    /**
     * Fetch cells from server 
     * 
     * @param page
     * @param recurse 
     * 
     * @returns {undefined}
     */
    fetchCells: function(page, size, recurse){
        var that = this;
        var tabId = that.tabId;
        
        $.ajax({
            'url': API_URL + '/api/network/cells',
            'data': { page: page, size: size },
            'dataFormat': 'json',
            success: function(data){
                var last = data.last;
                var totalPages = data.totalPages;
                var totalElements = data.totalElements;
                var size = data.size;
                var number = data.number;
                var sort = data.sort;
                var numberOfElements = data.numberOfElements;
                var first = data.first;
                
                that.loadCells(data.content);
                
                if(last === false && recurse === true ){
                    $('#'+tabId + ' .bd-notice').html( AppUI.I().Loading('Loading cells... [' + page*size + '/' + totalElements  + ' loaded]'));
                    that.fetchCells(page+1, size, true);
                }
                
                if(last === true ){
                    $('#'+tabId + ' .bd-notice').html(AppUI.I().Alerts({close:true}).Success( totalElements + ' cells loaded'));   
                }

            }
        });
        
    },
    
    /**
     * Load the cells on the map
     * 
     * @returns 
     */
    loadCells : function(cellList){
        var that = this;
        
        $.each(cellList,function(key, value){
            var sectorCarrier = value.siteSectorCarrier.substr(value.siteSectorCarrier.length-4);

            var color = that.freqColorMap[value.uarfcnUl];
            //var color = colors[sectorCarrier];
            var sector = L.semiCircle([value.latitude, value.longitude], {radius: value.cellRange/50, color: color})
            .setDirection(value.azimuth, 45)
            .addTo(that.map);
    
            var h = '';
            h += '<button class="btn btn-info">Details</button> ';
            h += '<button class="btn ">Show neighbours</button>';
            h += '<br />';
            h += '<div style="height:400px; overflow:auto;">';
            h += '<table class="table">';
            $.each(value, function(k, v){
                if( k == 'pk' || k == 'sitePk' || k == 'cellPk' || k == 'notes' || k == 'vendorPk' ||
                    k == 'technologyPk' || k == 'dateAdded' || k == 'dateModified' || 
                            k == 'addedBy' || k == 'modifiedBy') return;

                if(k=='dateAdded') v = new Date(v);
                h += '<tr><td>' + k + '</td><td>' + v + '</td></tr>'; 
            });
            h += '</table>';
            h += '</div>';

            sector.bindPopup(h);
        });        
    }

});
module.exports = GISView;