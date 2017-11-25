var VendorModel = require('../models/vendor_model');

var VendorsCollection = Backbone.Collection.extend({
    url: window.API_URL + '/api/vendors',
    model: VendorModel
});

module.exports = VendorsCollection;