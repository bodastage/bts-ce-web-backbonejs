var AuditRuleFieldModel = require('../models/audit_rule_field_model');

var AuditRuleFieldCollection = Backbone.Collection.extend({
    url: 'http://localhost:8080/api/networkaudit/rules/fields/1',
    model: AuditRuleFieldModel
});

module.exports = AuditRuleFieldCollection;