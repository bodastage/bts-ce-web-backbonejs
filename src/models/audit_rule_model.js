var AuditRuleModel = Backbone.Model.extend({
    urlRoot: 'http://localhost:8080/api/networkaudit/rules/',
    defaults: {}
});
module.exports = AuditRuleModel;