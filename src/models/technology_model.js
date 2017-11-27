var TechnologyModel = Backbone.Model.extend({
    urlRoot: window.API_URL + '/api/technologies',
    defaults: {
        name: '',
        notes: ''
    },
    parse: function(response, options){
        response.id = response.pk;
        return response;
    }
});
module.exports = TechnologyModel;