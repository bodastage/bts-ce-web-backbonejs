var AuditRuleModel = Backbone.Model.extend({
    urlRoot: 'http://localhost:8080/api/networkaudit/rule/',
    defaults: {},
    parse: function(response, options){
        var link = response._links.self.href;
        var linkPartsArray = link.split('/');
        response.auditRule.id = linkPartsArray[linkPartsArray.length-1];
        return response.auditRule;
    }
});
module.exports = AuditRuleModel;