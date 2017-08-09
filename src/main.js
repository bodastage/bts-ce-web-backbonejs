'use strict';

import 'bootstrap/dist/css/bootstrap.min.css';

require("./style.css");
require("jquery-ui/ui/widgets/sortable");

const appRouter = require('./router');
const AppUI = require('./libs/app-ui');
var AppView = require('./views/app_view');

var appView = new AppView();

appRouter();

Backbone.history.start();

    //Initiailzie Tabdrop
AppUI.I().Tabs().closeTabEvent();
AppUI.I().Tabs().initTabDrop();

$('#bd_nav_tab').sortable();