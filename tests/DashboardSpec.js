/**
 * Dashboard module unit tests
 * @version 1.0.0 
 */

//@TODO: I thought this is automatically loaded by the webpack entry point
require('../src/main.js');

var DashboardView = require('../src/views/dashboard_view.js');

describe('Dashboard Module', function () {
    var dashboardView;
    var d = document.querySelector('.icon-display');
    
    //Initialize the dashboardView
    beforeAll(function () {
         dashboardView = new DashboardView();
         dashboardView.render();
    });
    
    beforeEach(function () {
        
    });
    
    it("should load the dashboard icons", function() {
         expect(d.nodeName).toBe('DIV');
    });
});