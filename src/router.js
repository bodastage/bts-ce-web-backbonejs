'use strict';

var AppRouter = Backbone.Router.extend({
    routes: {
        'dashboard': 'loadDashboard', //Load dashboard module
        'help': 'loadHelp',
        'netaudit': 'loadNetworkAudit',
        'mobrowser': 'loadMOBrowser',
        'processes': 'loadProcesses',
        'netmgt': 'loadNetworkManagement',
        'networkinventory': 'loadNetworkInventory',
        'baseline': 'loadBaseline',
        'settings': 'loadSettings',
        'gis': 'loadGIS',
        "*actions": "defaultRoute"
    }
});

var modules = {};

var initialize = function () {
    var appRouter = new AppRouter;
    
    var DashboardView = require('./views/dashboard_view');
    modules.dashboard = new DashboardView();
    
    var HelpView = require('./views/help_view');
    modules.help = new HelpView();

    //Load dashboard
    appRouter.on('route:loadDashboard', function () {
        modules.dashboard.render();
    });

    //Load Settings module
    appRouter.on('route:loadSettings', function () {
        if (typeof modules.settings !== 'undefined') {
            modules.settings.reload();
        } else {
            var SettingsView = require('./views/settings_view');
            modules.settings = new SettingsView();
            modules.settings.render();
        }
    });
    

    //Load help module
    appRouter.on('route:loadHelp', function () {
        modules.help.render();
    });

    //Load network audit module
    appRouter.on('route:loadNetworkAudit', function () {
        if (typeof modules.networkaudit !== 'undefined') {
            modules.networkaudit.render();
        } else {
            var NetworkAuditView = require('./views/networkaudit_view');
            modules.networkaudit = new NetworkAuditView();
            modules.networkaudit.render();
        }
    });

    //Load processes module
    appRouter.on('route:loadProcesses', function () {
        if (typeof modules.processes !== 'undefined') {
            modules.processes.render();
        } else {
            var ProcessesView = require('./views/processes_view');
            modules.processes = new ProcessesView();
            modules.processes.render();
        }
    });

    //Load network invetory module
    appRouter.on('route:loadNetworkInventory', function () {
        if (typeof modules.networkinventory !== 'undefined') {
            modules.networkinventory.render();
        } else {
            var NetworkInventoryView = require('./views/networkinventory_view');
            modules.networkinventory = new NetworkInventoryView();
            modules.networkinventory.render();
        }
    });
    
    //Load gis module
    appRouter.on('route:loadGIS', function () {
        if (typeof modules.gis !== 'undefined') {
            modules.gis.render();
        } else {
            var GISView = require('./views/gis_view');
            modules.gis = new GISView();
            modules.gis.render();
        }
    });
    
    //Load mobrowser module
    appRouter.on('route:loadMOBrowser', function () {
        if (typeof modules.mobrowser !== 'undefined') {
            modules.mobrowser.render();
        } else {
            var MOBrowserView = require('./views/mobrowser_view');
            modules.mobrowser = new MOBrowserView();
            modules.mobrowser.render();
        }
    });
    
    //Load loadNetworkManagement module
    appRouter.on('route:loadNetworkManagement', function () {
        if (typeof modules.netmgt !== 'undefined') {
            modules.netmgt.render();
        } else {
            var NetworkManagementView = require('./views/networkmanagement_view');
            modules.netmgt = new NetworkManagementView();
            modules.netmgt.render();
        }
    });
    
    //Load baseline module
    appRouter.on('route:loadBaseline', function () {
        if (typeof modules.baseline !== 'undefined') {
            modules.baseline.render();
        } else {
            var BaselineView = require('./views/baseline_view');
            modules.baseline = new BaselineView();
            modules.baseline.render();
        }
    });
    
    //Default route
    appRouter.on('route:defaultRoute', function () {
    });

    //Show Dashboard by default
    modules.dashboard.render();
};

module.exports = initialize;