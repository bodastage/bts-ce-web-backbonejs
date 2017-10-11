'use strict';

//The layout template
require('style-loader!../vendors/jqlayout/layout-default.css');
const containerTemplate = require('html-loader!../templates/container.html');
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
                    Tether.position();
                },
            },
            south: {
                initClosed: true,
            },
            west: {
                size: '300',
                onresize_end: function () {
                    AppUI.I().Tabs().execDropTab();
                    Tether.position();
                }
            },
            center: {
                onresize_end: function () {
                    AppUI.I().Tabs().execDropTab();
                    Tether.position();
                }
            }
        });

    }

});

module.exports = AppView;