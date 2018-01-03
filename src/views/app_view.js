'use strict';

//The layout template
require('style-loader!../vendors/jqlayout/layout-default.css');
var  containerTemplate = require('html-loader!../templates/container.html');
var  AppUI = require('../libs/app-ui');
var SessionView  = require('./session_view');

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

        var sessionView = new SessionView();
        sessionView.render();

        this.$el.html(this.template({username: "Username"}));

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