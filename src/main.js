'use strict';

import 'bootstrap/dist/css/bootstrap.min.css';

/*
 * Include font awesome
 * 
 * Font awesome icons
 */
require("font-awesome-webpack");


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
//window.Tether = require('tether');
//window.Drop = require('tether-drop');

//Popover library
//window.Popper  = require('popper.js').default;

const appRouter = require('./router');

//Include the APP UI libraries
window.AppUI = require('./libs/app-ui');

var AppView = require('./views/app_view');

//Include the spring friendly js for using databases
//they convert
import './libs/jquery.spring-friendly.js';

//Include data tables and bootstramp styles
$.fn.DataTable = require('datatables.net');
require('datatables.net-bs');
require('datatables.net-bs/css/dataTables.bootstrap.css');

var appView = new AppView();

appRouter();

Backbone.history.start();

//Initiailzie Tabdrop
AppUI.I().Tabs().closeTabEvent();
AppUI.I().Tabs().initTabDrop();

//Set url
window.API_URL = 'http://localhost:8080';

//Enable sorting of tabs
$('#bd_nav_tab').sortable();

//window.Stomp = require('stompjs');
//window.SockJS = require('sockjs-client');
//var socket = new SockJS('http://localhost:8080/websocket');
//var stompClient = Stomp.over(socket);
// socket.onopen = function() {
//     console.log('open');
//     socket.send('test');
// };
//
// socket.onmessage = function(e) {
//     console.log('message', e.data);
//     socket.close();
// };
//
// socket.onclose = function() {
//     console.log('close');
// };