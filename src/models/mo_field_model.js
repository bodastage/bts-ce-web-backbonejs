var MOFieldModel = Backbone.Model.extend({
    urlRoot: API_URL + '/api/managedobjects/mobrowser/',
    defaults: {}
});
module.exports = MOFieldModel;