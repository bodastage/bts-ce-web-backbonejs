var SettingModel = require('../models/setting_model');

var SettingsCollection = Backbone.Collection.extend({
    url: window.API_URL + '/api/settings/',
    model: SettingModel
});

module.exports = SettingsCollection;