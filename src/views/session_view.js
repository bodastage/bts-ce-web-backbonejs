'use strict';

var loginTemplate = require('html-loader!../templates/session/login.html');

var SessionView = Backbone.View.extend({

    el: 'body',

    events: {
        'submit form.form-signin': 'login', //@TODO: Why is this event not being called 
        'click .logout': 'logout'
    },

    initialize: function () {
    },

    render: function () {
        var that = this;

        //@TODO: Append to body instead of html
        $('html').append(_.template(loginTemplate));

        $('form.form-signin').on('submit', function (event) {
            return that.login(event);
        });
    },

    login: function (event) {
        $('.login-mask').remove();
        console.log('Login...');

        return false;
    },

    logout: function () {

    }
});

module.exports = SessionView;