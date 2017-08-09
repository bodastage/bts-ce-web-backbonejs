'use strict';

//The layout template
require('style-loader!../vendors/jqlayout/layout-default.css');
const containerTemplate = require('raw-loader!../templates/container.html');
const AppUI = require('../libs/app-ui');


// Top-level UI.
var AppView = Backbone.View.extend({

    el: 'body',

    template: _.template(containerTemplate),

    events: {},

    //Intialize. 
    initialize: function () {
        
        //render app
        this.render();
    },

    render: function () {

        this.$el.html(this.template({username: "Bodastage"}));

        $('body').layout({applyDemoStyles: true,
            north: {
                maxSize: '50',
                resizable: false,
                size: '50',
                onopen_end: function () {
                },
            },
            south: {
                initClosed: true,
            },
            west: {
                size: '300',
                onresize_end: function () {
                    AppUI.I().Tabs().execDropTab();
                }
            },
            center: {
                onresize_end: function () {
                    AppUI.I().Tabs().execDropTab();
                }
            }
        });

    }

});

module.exports = AppView;