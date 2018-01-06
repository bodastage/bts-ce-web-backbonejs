var SettingModel = Backbone.Model.extend({
    urlRoot: window.API_URL + '/api/settings/',
    defaults: {
    },
    parse: function(response, options){
        return response;
    }
});
module.exports = SettingModel;