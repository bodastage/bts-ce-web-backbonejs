var VendorTechModel = require('../models/vendor_tech_model');

var VendorsTechCollection = Backbone.Collection.extend({
    url: window.API_URL + '/api/settings/network/technologies/',
    model: VendorTechModel
});

module.exports = VendorsTechCollection;