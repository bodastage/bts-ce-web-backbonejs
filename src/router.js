var AppRouter = Backbone.Router.extend({
    routes: {
        'dashboard': 'loadDashboard', //Load dashboard module
        'help': 'loadHelp',
        'netaudit': 'loadNetworkAudit',
        "*actions": "defaultRoute"
    }
});

var modules={};
    
var initialize = function () {
    var appRouter = new AppRouter;
    
    //Load dashboard
    appRouter.on('route:loadDashboard', function () {
        if (typeof modules.dashboard !== 'undefined') {
            modules.dashboard.reload();
        } else {
            modules.dashboard = new DashboardView();
            modules.dashboard.render();
        }
    });

    //Load processes module
    appRouter.on('route:loadProcesses', function () {
        if (typeof modules.processes !== 'undefined') {
            modules.processes.reload();
        } else {
            require(['./views/processes_view'], function (ProcessesView) {
                modules.processes = new ProcessesView();
                modules.processes.render();
            });
        }
    });

    //Load Settings module
    appRouter.on('route:loadSettings', function () {
        if (typeof modules.settings !== 'undefined') {
            modules.settings.reload();
        } else {
            require(['./views/settings_view'], function (SettingsView) {
                modules.settings = new SettingsView();
                modules.settings.render();
            });
        }
    });

    //Load network audit module
    appRouter.on('route:loadNetworkAudit', function () {
        console.log('loadNetworkAudit');
        if (typeof modules.networkaudit !== 'undefined') {
            modules.networkaudit.reload();
        } else {
            require(['./views/networkaudit_view'], function (NetworkAuditView) {
                modules.networkaudit = new NetworkAuditView();
                modules.networkaudit.render();
            });
        }
    });

    //Default route
    appRouter.on('route:defaultRoute', function () {
    });

    //Show Dashboard by default
    require(['./views/dashboard_view'], function (DashboardView) {
        var dashboardView = new DashboardView();
        modules.dashboard = new DashboardView();
        modules.dashboard.render();
    });
};

module.exports = initialize;