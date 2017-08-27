'use strict';

import 'bootstrap/dist/css/bootstrap.min.css';

require("./style.css");
require("jquery-ui/ui/widgets/sortable");

const appRouter = require('./router');
const AppUI = require('./libs/app-ui');
var AppView = require('./views/app_view');

//Include data tables
$.fn.DataTable = require('datatables.net');
require('datatables.net-bs');

//require('datatables.net-buttons');
//11require('datatables.net-buttons-bs');


var appView = new AppView();

appRouter();

Backbone.history.start();

    //Initiailzie Tabdrop
AppUI.I().Tabs().closeTabEvent();
AppUI.I().Tabs().initTabDrop();

$('#bd_nav_tab').sortable();