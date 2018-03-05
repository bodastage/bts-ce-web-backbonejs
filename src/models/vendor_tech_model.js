var VendorTechModel = Backbone.Model.extend({
    urlRoot: window.API_URL + '/api/settings/network/technologies/',
    defaults: {
        name: '',
        notes: ''
    },
    parse: function(response, options){
        response.id = response.pk;
        return response;
    }
});
module.exports = VendorTechModel;