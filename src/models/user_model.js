var UserModel = Backbone.Model.extend({
    urlRoot: window.API_URL + '/api/users',
    defaults: {
    },
    parse: function(response, options){
        response.id = response.pk;
        return response;
    }
});
module.exports = UserModel;