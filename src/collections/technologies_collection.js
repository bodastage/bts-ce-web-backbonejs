var TechnologyModel = require('../models/technology_model');

var TechnologiesCollection = Backbone.Collection.extend({
    url: window.API_URL + '/api/technologies',
    model: TechnologyModel
});

module.exports = TechnologiesCollection;