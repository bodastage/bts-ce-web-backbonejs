'use strict';

var loginTemplate = require('html-loader!../templates/session/login.html');

var SessionView = Backbone.View.extend({

    el: 'body',

    events: {
        'submit form.form-signin': 'login', //@TODO: Why is this event not being fired 
        'click .logout': 'logout'
    },

    initialize: function () {
        
    },

    render: function () {
        var that = this;

        if(localStorage.getItem("token") === null){
            //@TODO: Append to body instead of html
            $('html').append(_.template(loginTemplate));
                
            $('html').on('submit','form.form-signin', function (event) {
                return that.login(event);
                //return false;
            });
            
            return;
        }else{
            
            that.addTokenToAjaxHeaders();
            
            //Update firstname
            setTimeout(function(){
                $('body').find('.session-user-name').html(localStorage.getItem("firstName"));
            },1000);

            
        }

    },

    login: function (event) {
        var that = this;
        //$('.login-mask').remove();
        
        $('html').find('form.form-signin [type=submit]').html('<i class="fa fa-spinner  fa-spin fa-fw"></i> Authenticating...');
        
        $.ajax({
            'url' : API_URL + '/authenticate',
            'type': "POST",
            'headers': {
                'X-Auth-Username': $('html').find('form.form-signin input[name=session_email]').val(),
                'X-Auth-Password': $('html').find('form.form-signin input[name=session_password]').val()
            },
            "success": function(data, textStatus, jqXHR ){
                localStorage.setItem("id", data.id);
                localStorage.setItem("firstName", data.firstName);
                localStorage.setItem("fullName", data.fullName);
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.username);
                
                //Update firstname
                $('body').find('.session-user-name').html(data.firstName);
                
                $('.login-mask').remove();
                
                that.addTokenToAjaxHeaders();
            },
            "error": function(jqXHR, textStatus, errorThrown ){
                try{
                var response = JSON.parse(jqXHR.responseText);
                    $('.form-signin-notices').html(AppUI.I().Alerts({close:true}).Error(response.message))
                }catch(e){
                    console.log(e);
                    $('.form-signin-notices').html(AppUI.I().Alerts({close:true}).Error("Error occured!"))
                }
                
                $('form.form-signin [type=submit]').html( $('form.form-signin [type=submit]').data('placeholder'));
            }
        });
        
        return false;
    },

    /**
     * 
     * @returns {undefined}
     */
    addTokenToAjaxHeaders: function(){
        $.ajaxSetup({
            beforeSend: function (xhr)
            {
               //xhr.setRequestHeader("Accept","application/vvv.website+json;version=1");
               xhr.setRequestHeader("X-Auth-Token",localStorage.getItem("token"));        
            }
        });
    },
    logout: function () {
        localStorage.clear();
        $('html').append(_.template(loginTemplate));
    }
});

module.exports = SessionView;