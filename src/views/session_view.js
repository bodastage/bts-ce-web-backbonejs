'use strict';

var loginTemplate = require('html-loader!../templates/session/login.html');

var SessionView = Backbone.View.extend({

    el: 'body',

    events: {
        'submit form.form-signin': 'login', //@TODO: Why is this event not being fired 
        'click .logout': 'logout',
        'click .bd-forgot-password-link': 'showResetPasswordForm'
    },

    initialize: function () {
        
    },

    render: function () {
        var that = this;

        if(localStorage.getItem("token") === null){
            //@TODO: Append to body instead of html
            $('html').append(_.template(loginTemplate));
                
            //login
            $('html').on('submit','form.form-signin', function (event) {
                return that.login(event);
                //return false;
            });
            
            //Show login form 
            $('html').on('click', '.bd-sign-in-link', function(event){
                $('.form-reset-password').css('display','none');
                $('.form-register').css('display','none');
                $('.form-signin').css('display','block');
                
            });
            
            //Show reset password form
            $('html').on('click','.bd-forgot-password-link', function(event){
                $('.form-signin').css('display','none');
                $('.form-register').css('display','none');
                $('.form-reset-password').css('display','block');
            });
            
            //Reset password
            $('html').on('submit','form.form-reset-password', function (event) {
                return that.resetPassword(event);
                //return false;
            });
            
            //Show registration form
            $('html').on('click','.bd-register-link', function(event){
                $('.form-reset-password').css('display','none');
                $('.form-signin').css('display','none');
                $('.form-register').css('display','block');
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
            'url' : API_URL + '/authenticate/',
            'type': "POST",
            'xhrFields': {
                    withCredentials: true
            },
            'data': {
                'username': $('html').find('form.form-signin input[name=session_email]').val(),
                'password': $('html').find('form.form-signin input[name=session_password]').val()
            },
            "success": function(data, textStatus, jqXHR ){
                localStorage.setItem("id", data.id);
                localStorage.setItem("firstName", data.first_name);
                localStorage.setItem("lastName", data.last_name);
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
               var token = localStorage.getItem("token");
               xhr.setRequestHeader("Authorization","Bearer " + token);        
            }
        });
    },
    logout: function () {
        localStorage.clear();
        $('html').append(_.template(loginTemplate));
    },
    
    resetPassword: function(event){
        $('html').find('form.form-reset-password [type=submit]').html('<i class="fa fa-spinner  fa-spin fa-fw"></i> Resetting password...');
        
        return false;
    },
    
    showResetPasswordForm: function(){
        $('.form-signin').css('display','none');
        $('.form-reset-password').css('display','block');
    }
});

module.exports = SessionView;