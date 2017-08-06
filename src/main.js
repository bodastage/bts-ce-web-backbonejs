'use strict';
//
import 'bootstrap/dist/css/bootstrap.min.css';

//require('./vendors');
require("./style.css");
require("jquery-ui/ui/widgets/sortable");

const appRouter = require('./router');
const AppUI = require('./libs/app');
var AppView = require('./views/app_view');

var initialize = function() {
    var appView = new AppView();
    
    appRouter();
    
    Backbone.history.start();
    
	//Initiailzie Tabdrop
    AppUI.I().Tabs().closeTabEvent();
    AppUI.I().Tabs().initTabDrop();
    
    $('#bd_nav_tab').sortable();
}

module.export = initialize();