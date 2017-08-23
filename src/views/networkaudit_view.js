'use strict';

const AppUI = require('../libs/app-ui');
var dashboardTmpl = require('raw-loader!../templates/networkaudit/dashboard.html');
var leftPanelTmpl = require('raw-loader!../templates/networkaudit/left-pane.html');

var NetworkAuditView = Backbone.View.extend({
    el: 'body',

    //tab Id for the network audit dashboard
    tabId: 'tab_networkaudit',
    render: function () {
        this.loadDashboard();
        AppUI.I().Tabs().setContent({
            id: this.tabId,
            content: dashboardTmpl
        });
        this.loadLeftPane();
    },

    /**
     * Initialize view
     * 
     * @version 1.0.0
     * @return void
     */
    initialize: function () {
        this.render();
    },

    /**
     * Load module dashboard
     *  
     * @version 1.0.0
     * @return void
     */
    loadDashboard: function () {
        AppUI.I().Tabs().addTab({
            id: this.tabId,
            title: '<img src="assets/images/discrepancy_black_100.png" \
                width="16px" class="img-icon"/> Network Audit</b>',
            content: AppUI.I().Loading('<h3>Loading network audit module...</h3>')
        });
        AppUI.I().Tabs().show({id: this.tabId});
    },

    /**
     * Load left pane
     * 
     * @returns void
     */
    loadLeftPane: function () {
        var that = this;
        AppUI.I().ModuleMenuBar().setTitle('<img src="assets/images/discrepancy_black_100.png" width="32px" class="img-icon"/> Network Audit	');

        AppUI.I().getLeftModuleArea().html(leftPanelTmpl);

        //Load ACI Tree of rules and categories
        try {
        var aciTreeAPI = $('#bd_auditrules_tree').aciTree({
            ajax: {
            url: 'http://localhost:8080/api/networkaudit/acitree/categories/0',
            data: {
                searchRules: function () {
                    return $(that.$el).find('[name=bd_filter_audit_rules]').is(':checked');
                },
                searchCategories: function () {
                    return $(that.$el).find('[name=bd_filter_audit_cats]').is(':checked');
                },
                searchTerm: function () {
                    return $(that.$el).find('#bd_audit_filter').val();
                }
            }//oef:data
        },
        ajaxHook: function (item, settings) {

            //Change the URL to rules if the parent is categories	
            if (item) { // id is not null
                settings.url = settings.url.replace('categories', 'rules');
            }
            settings.url += (item ? this.getId(item) : '');
        },
        itemHook: function (parent, item, itemData, level) {
            var properties = this.itemData(item);
            if (properties['nodeType'] == 'category') {
                $('#bd_auditrules_tree').aciTree('api').addIcon(item,
                {
                    success: function (item, options) {},
                    fail: function (item, options) {},
                    icon: 'bd-aciTree-glyphicon glyphicon glyphicon-tags '
                });
            } else {//rule: 
                $('#bd_auditrules_tree').aciTree('api').addIcon(item,
                    {
                        success: function (item, options) {},
                        fail: function (item, options) {},
                        icon: 'bd-aciTree-glyphicon glyphicon glyphicon-tint '
                    });
            }

        }
        });
        
        //Trigger search when the rules and category checkboxes are checked
        $('[name=bd_filter_audit_rules],[name=bd_filter_audit_cats]').on('change', function () {
            $('#bd_audit_filter').trigger('keyup');
        });
        
        //Keyup event on the rule search text field. When the user types some text in the search field
        //the aciTree is reloaded to show the filtered results.
        $('#bd_audit_filter').on('keyup', function () {
            $('#bd_auditrules_tree').aciTree('api').unload(null,{
                success: function () {
                    $('#bd_auditrules_tree').aciTree('api').ajaxLoad();
                }
            });
        });
        
            //Category and rules context menu
        $('#bd_auditrules_tree').contextMenu({
            selector: '.aciTreeLine',
            build: function(element){
            var menu = {};
                var api = $('#bd_auditrules_tree').aciTree('api');
                var item = api.itemFrom(element);
                var itemId = api.getId(item);
                var properties = api.itemData(item);

                //Category context menu items
                if (properties['nodeType'] == 'category'){
                    
                    //Reload rules under category
                    menu['reload_category'] = {
                        name: 'Refresh',
                            callback: function() {
                                api.unload(item, {
                                    success: function(){ 
                                                api.ajaxLoad(item, {
                                                    success: function(){
                                                        api.open(item);
                                                    }, 
                                                    fail: function(){}, unanimated: false}); 
                                    }
                                });
                            }//eof:callback
                        };
                }//eof: nodeType == category
                
                //Audit rule context menu items
                if(properties['nodeType'] == 'rule'){
                    menu['load_rule']  = {
                        name: 'Load',
                        callback: function() {
                            //@TODO: Add load logic
                        }//eof:callback
                    };

                }//eof: nodeType == rule
                
                return {
                    autoHide: true,
                    items: menu
                };
            }
        });//eof:contexMenu

    }catch(err) {
        console.log(err);
    }


    }
});

module.exports = NetworkAuditView;