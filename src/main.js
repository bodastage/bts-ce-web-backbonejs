'use strict';

/**
 * Import bootstrap css
 */
import 'bootstrap/dist/css/bootstrap.min.css';

/*
 * Include Font awesome icons
 * 
 */
require("font-awesome-webpack");

/**
 * Include leaflet for the GIS Module
 */
require("leaflet");
require("leaflet_css");
require("leaflet_marker");
require("leaflet_marker_2x");
require("leaflet_marker_shadow");
require("leaflet-semicircle"); 
require("leaflet.heat");
/**
 * 
 * @type Module router|Module router
 */
window.Plotly = require('./libs/boda-plotly');

/**
 * 
 * Add application styles
 */
require("./style.css");

//Add sorting to taps
require("jquery-ui/ui/widgets/sortable");

//Include drop-tetber 
window.Tether = require('tether');
window.Drop = require('tether-drop');
require('tether-drop/dist/css/drop-theme-arrows.css');

//Popover library
//window.Popper  = require('popper.js').default;

//const appRouter = require('./router');
var appRouter = require('./router');


//Include the APP UI libraries
window.AppUI = require('./libs/app-ui');

var AppView = require('./views/app_view');

//Include the spring friendly js for using databases
//they convert
//import './libs/jquery.spring-friendly.js';

//Include data tables and bootstramp styles
$.fn.DataTable = require('datatables.net');
require('datatables.net-bs');
require('datatables.net-bs/css/dataTables.bootstrap.css');

//Add jquery datatables column re-order plug -in
require( 'datatables.net-colreorder' );

//Set API URL
window.API_URL = $.getParameterByName('api_server') || 'http://localhost:8181';
//window.API_URL = 'http://192.168.43.252:8080';

console.log(window.API_URL);

var appView = new AppView();

appRouter();

Backbone.history.start();

//Initiailzie Tabdrop
AppUI.I().Tabs().closeTabEvent();
AppUI.I().Tabs().initTabDrop();



//Enable sorting of tabs
$('#bd_nav_tab').sortable();
 
 
//Register global callback for unauthenticated api requests
$(document).ajaxError(function( event, jqxhr, settings, thrownError ) {
    if(jqxhr === 401){
        $.confirm({
            "icon": 'fa fa-warning',
            "title": "Authentication required",
            content: 'Log into application again',
            buttons: {
                "login": function(){
                    $('body .logout').trigger('click');
                }
            }
        });
    }

    if(jqxhr.readyState == 0){
        $.alert({
            "icon": "fa fa-warning",
            "title": "Connection error",
            "content": "Check your network connectivity"
        });
    }
});

 ///
//window.Stomp = require('stompjs');
//window.SockJS = require('sockjs-client');

/**
var socket = new SockJS( window.API_URL + '/websocket');
var stompClient = Stomp.over(socket);  

 function connect() {
    stompClient.connect({}, function(frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/export-status', function(messageOutput) {
            console.log("Received:" + messageOutput);
        });
    });
}

function disconnect() {
    if(stompClient != null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}
             
function sendMessage() {
    stompClient.send('/topic/export-status', {}, 
      JSON.stringify({'from':"client1", 'text':"texdt2"}));
}

connect();
**/