require('../vendors/aciTree/css/aciTree.css');
require('../vendors/jqueryContextMenu/jquery.contextMenu.css');

require('imports-loader?this=>window!bootstrap/dist/js/bootstrap.min');

require("jquery-ui/ui/core");
require("jquery-ui/ui/widgets/draggable");
require("jquery-ui/ui/effects/effect-slide");
require("jquery-ui/ui/effect");
require("jquery-ui/ui/effects/effect-drop");
require("jquery-ui/ui/effects/effect-scale");

require('imports-loader?this=>window!../vendors/jqlayout/jquery.layout');

require('imports-loader?this=>window!../vendors/tabdrop/js/bootstrap-tabdrop');

//ACI Tree Plugin
require('imports-loader?this=>window!../vendors/aciTree/js/jquery.aciPlugin.min.js');
require('imports-loader?this=>window!../vendors/aciTree/js/jquery.aciTree.min.js');

//contextMenu
require('../vendors/jqueryContextMenu/jquery.contextMenu.js');


var AppUI = (function (jQ, window) {
    var ui_instance;

    function _createInstance(name) {
        //Private
        d_states  = {};
        var _layoutEventHandlers = [];
        
        var loadingDialog = jQ('<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
		'<div class="modal-dialog modal-m">' +
		'<div class="modal-content">' +
			'<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
			'<div class="modal-body">' +
				'<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
			'</div>' +
		'</div></div></div>');

        var UIDialog = jQ(  ' ' +
                '<div class="modal fade" id="bd_app_model" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"> ' +
                '  <div class="modal-dialog" role="document"> ' +
                '    <div class="modal-content"> ' +
                '      <div class="modal-header"> ' +
                '        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> ' +
                '        <h4 class="modal-title" id="bd_app_model_label">New message</h4> ' +
                '      </div> ' +
                '      <div class="modal-body"></div> ' +
                '      <div class="modal-footer"> ' +
                '        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> ' +
                '        <button type="button" class="btn btn-primary">Save</button> ' +
                '      </div> ' + 
                '    </div> ' + 
                '  </div> ' + 
            '</div> '
            );
    
            var modalOnClick = function(){}
            
            //UIDialog.find('button.btn-primary').click(function(){
            UIDialog.find('button.btn-primary').on('click',function(){
                modalOnClick();
            });
            
        //Public
        return {
            run: function(){
                AppUI.getInstance().Tabs().closeTabEvent();
                AppUI.getInstance().Tabs().initTabDrop();
                AppUI.getInstance().SideBar().collapseEvent();
                AppUI.getInstance().ModuleMenuBar().collapseEvent();
                
                
                
            },
            setTitle : function( title ){
                jQ("#bd_app_title").html( title );
            },
            setWindowTitile :  function( text ){
                window.document.title = text;
            },
            Loading: function( message ){
                message = ( 'undefined' === typeof message ) ? 'Loading...': message;
                var h = '<div>'+ message + '</div>';
                h += '<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>';
                return h;
            },
            loadingPage: function( ){
                
                return {
                    show : function( message ){
                        if( 'undefined' != message ){
                            loadingDialog.find('h3').text(message);
                            loadingDialog.modal('show');
                        }else{
                            loadingDialog.modal('show');
                        }
                    },
                    hide: function(){
                        loadingDialog.modal('hide');
                    }
                }
            },
            ModuleMenuBar: function(){
                return {
                    init: function(){
                        AppUI.I().getLeftModuleArea().html('<div class="bd_app_module_menu"><ul class="nav nav-pills nav-stacked"></ul></div>');
                    },
                    setTitle: function(text){
                        jQ(".bd_app_module_title").html( text );
                    },
                    setIcon: function( options ){
                        var imgHTML = '<img src="'+ options.img +'" width="32px;" /> ';
                        jQ(".bd_app_module_title").prepend( imgHTML );
                    },
                    addItem: function( data ){
                        v_active = (data.active == 1)?"active":"";
                        AppUI.I().getLeftModuleArea().find(".bd_app_module_menu ul ").append( 
                            '<li role="presentation" action="'+data.action+'" class="'+ v_active +'"><a href="#">'+ data.label +'</a></li>'
                        );
                    },
                    clearItems : function(){
                        AppUI.I().getLeftModuleArea().find(".bd_app_module_menu ul").empty();
                    },
                    toggle: function(){
                        var _this = jQ('.bd_collapse_module_menu_icon');
                        if( jQ(_this).hasClass('glyphicon-arrow-up')){
                            jQ(_this).removeClass('glyphicon-arrow-up');
                            jQ(_this).addClass('glyphicon-arrow-down')
                        }else{
                            jQ(_this).removeClass('glyphicon-arrow-down');
                            jQ(_this).addClass('glyphicon-arrow-up');

                        }
                        jQ('#bd_app_module_menu_container').toggle();
                    },
                    collapseEvent: function(){
                        jQ('.bd_collapse_module_menu_icon').click(function(){
                            AppUI.getInstance().ModuleMenuBar().toggle();
                        });
                    },
                    selectItem: function(action){
                        jQ(".bd_app_module_menu ul").find('li').removeClass('active');
                        jQ(".bd_app_module_menu ul ").find('li[action='+action+']').addClass('active');
                    }
                }
                
            },
            getModuleArea: function(){
                return jQ("#bd_app_module_area");
            },
            getLeftModuleArea: function(){
                //return AppUI.getInstance().getModuleArea().find('#bd_reports_panel_left #bd_sidebar_fixed_width');
                return jQ('#bd_reports_panel_left #bd_sidebar_fixed_width');
            },
            getRightModuleArea: function(){
                return AppUI.getInstance().getModuleArea().find('#bd_reports_panel_right');
            },
            getModal  : function (){
                
                return {
                    init: function(options){//title,content,submitText,removeSubmit,submitCallback
                    	UIDialog.find('button.btn-primary').off('click'); //unbind previous click events
                    			
                    	UIDialog.find('.modal-footer button.btn-primary').show();
                        if( typeof options.title != 'undefined' ) UIDialog.find('h4').html(options.title);
                        if( typeof options.content != 'undefined' ) UIDialog.find('.modal-body').html(options.content);
                        if( typeof options.submitText != 'undefined' ) UIDialog.find('.modal-footer button.btn-primary').html(options.submitText);
                        if( typeof options.removeSubmit != 'undefined'){
                        	//if(true === options.removeSubmit ) UIDialog.find('button.btn-primary').css({"display":"none"});
                        }
                        if( typeof options.submitCallback != 'undefined'){
                            UIDialog.find('button.btn-primary').on('click',function(event){
                            	options.submitCallback(event);
                            });
                        }
                        return UIDialog;
                    },
                    setTitle: function(title){
                        UIDialog.find('h4').html(title);
                    },
                    setContent: function(content){
                        UIDialog.find('.modal-body').html(content);
                    },
                    setSubmitText: function(content){
                        UIDialog.find('.modal-footer button.btn-primary').html(content);
                    },
                    getSearch: function(title, searchText){
                        searchText = (typeof searchText != 'undefined' )? searchText : 'Search for ...';
                        title = (typeof title != 'undefined' )? title : 'Search';
                        AppUI.getInstance().getModal().setTitle(title);
                        AppUI.getInstance().getModal().setContent( 
                        '<form>                                                                 '+
                        '  <div class="form-group">                                             '+
                        '    <label for="name-name" class="control-label">' + searchText + '</label>'+
                        '    <input type="text" class="form-control" id="name-name">             '+
                        '  </div>                                                               '+
                        '</form>                                                                '
                        );
                
                        return AppUI.getInstance().getModal().init();
                    },
                    removeSend: function(){
                        UIDialog.find('button.btn-primary').css({"display":"none"});
                    },
                    getSubmitBtn: function(){
                        return UIDialog.find('button.btn-primary');
                    },
                    togglePrimaryBtn: function( state ){
                        if( 'hide' == state ){
                            UIDialog.find('.modal-footer button.btn-primary').hide();
                        }else{
                            UIDialog.find('.modal-footer button.btn-primary').show();
                        }
                        
                    },
                    getObject : function(){
                        return UIDialog;
                    },
                    setOnClickEvt: function(callback){
                        AppUI.getInstance().getModal().getSubmitBtn().show();
                        modalOnClick = callback;
                    }
                    
                }
            },
            aciTree : function(id, options){
                // init the tree
               
               return {
                   init: function(id,options){

                        jQ('#'+id).aciTree({
                            ajax: {
                                url: options.url,
                                data: options.data
                            },
                            expand: false,
                            collapse: true,
                            //sortable: true,
                            // connect with the drop targets
                            sortOptions: {
                                connectDrop: '.drop'
                            },
                            // our custom filter/search
                            filterHook: function(item, search, regexp) {
                                if (search.length) {
                                    // try to get the parent
                                    var parent = this.parent(item);
                                    if (parent.length) {
                                        // get parent label
                                        var label = this.getLabel(parent);
                                        if (regexp.test(String(label))) {
                                            // all direct childrens match
                                            return true;
                                        }
                                    }
                                    // match the item
                                    return regexp.test(String(this.getLabel(item)));
                                } else {
                                    // empty search, all matches
                                    return true;
                                }
                            }
                        });
               
                        return  jQ('#'+id).aciTree('api');
                    },
                    refreshNode: function(api,item){

                        api.unload(item, {
                            success: function(item2, options){
                                
                                if( item == null ){ api.ajaxLoad(); return; }
                                
                                api.ajaxLoad(item2,{
                                    success: function(item3, options){
                                        api.open(item3);
                                        len = api.children(item,false,false).length;
                                        oldLabel = api.getLabel(item);
                                        console.log( 'Running refresh...');
                                        newLabel = oldLabel.replace(/\(\d+\)$/,'('+ len +')');
                                        api.setLabel(item,{
                                            success: function(item, options){
                                            },
                                            fail: function(){
                                            },
                                            label: newLabel
                                        });
                                        
                                    }
                                });     
                            }
                        });
                    }
                }//--refreshNode
                
            },//--
            dataTable: function(){
                return {
                    /*Create place holder html
                     * 
                     * options:
                     *          id : table id
                     *          columns: array of table column names ie [{name:"table name}, ...]
                     * */
                    initPlaceHolder: function(options){
                        var _th = '';

                        //Build table
                        for( var i in options.columns ){
                            _th += "<th>"+ options.columns[i].name +"</th>";
                        }

                        var html = '<div class="bd-telcomlib-vendors-table-style">' + 
                                    '<div class="bd-alerts"></div>' +
                                    '<div> <h1>'+options.title+'</h1> </div>' + 
                                    '<table id="' + options.id + '" class="table table-striped table-bordered" cellspacing="0" width="100%">' +
                                    '<thead><tr>' + _th + '</tr></thead>' +
                                    '<tfoot><tr>' + _th + '</tr></tfoot>' +
                                    '</table>'+
                                    '</div>';
                        return html;
                    },
                    /*
                     *options:
                     *      id: table id
                     *      data: dataTables data
                     *      url: url stem
                     *      initComplete: call back on completion of loading of the datatable 
                     * 
                     **/
                    init: function(options){
                        jQ('#' + options.id ).DataTable( {    
                             "processing": true,
                             "serverSide": true,    
                             "ajax": {
                                 url:   options.url, 
                                 type: 'POST',
                                 data: options.data
                             },
                            "columns": options.columns,
                            "columnDefs": ( 'undefined' !== options.columnDefs ) ? options.columnDefs : [],
                            initComplete: function () {
                                if( 'function' === typeof options.initComplete ) {
                                    options.initComplete();
                                }
                            },
                         });    
                    }
                }
            },
            /*id,title,content*/
            Tabs: function(){
                return{
                    addTab: function(options){
                        var iconHTML = ( 'undefined' != typeof options.icon )? '<span class="glyphicon glyphicon-'+options.icon +'"></span>':'';

                        //Check if tab is already open
                        var tabObj = AppUI.getInstance().getModuleArea().find('#bd_reports_panel_right').find('#bd_nav_tab').find('[href="#'+options.id+'"]' );
                        if( tabObj.length > 0 ){
                            tabObj.tab('show');
                            return;
                        }
                        var titleHTML = '<li role="presentation" ><a href="#'+options.id+'" aria-controls="home" role="tab" data-toggle="tab">' + iconHTML + ' <span class="bd_tab_title"> ' + options.title + '</span> <span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></li>';
                        var contentHTML = '<div role="tabpanel" class="tab-pane" id="'+ options.id + '">' + options.content + '</div>'; 
                        AppUI.getInstance().getModuleArea().find('#bd_reports_panel_right').find('#bd_nav_tab').append( jQ(titleHTML) );
                        AppUI.getInstance().getModuleArea().find('#bd_reports_panel_right').find('#bd_tab_content').append( jQ(contentHTML) );
                        jQ('.nav-tabs').tabdrop('layout');
                        jQ('#bd_nav_tab  a[href="#'+options.id+'"]').tab('show');//@TODO: Look into reason why the table is distored in FF and IE when this is removed
                    },
                    closeTabEvent: function(){
                        AppUI.I().getModuleArea().find('#bd_reports_panel_right').find('#bd_nav_tab').on('click', ' li a .glyphicon-remove', function() {
                            var tabId = jQ(this).parents('li').children('a').attr('href');
                            jQ(this).parent().remove();
                            jQ('.nav-tabs').tabdrop('layout');
                            jQ( tabId).remove();
                            jQ('#bd_nav_tab  a[href="#dashboard_tab"]').tab('show');
                            
                            //To do make sure backbone is included first
                            Backbone.history.navigate("/#/dashboard",true);
                        });
                    },
                    closeTab: function ( options ){
                        var tabId = options.id;
                        var _jQ = AppUI.I().getModuleArea().find('#bd_reports_panel_right').find('#bd_nav_tab a[href="#' + tabId + '"]');
                        _jQ.parent().remove();
                        jQ('.nav-tabs').tabdrop('layout');
                        jQ("#" + tabId).remove();
                        jQ('#bd_nav_tab  a[href="#dashboard_tab"]').tab('show');
                    },
                    setContent: function( options ){ //{id,content}
                        var contentHTML = '<div role="tabpanel" class="tab-pane" id="'+ options.id + '">' + options.content + '</div>';
                        AppUI.getInstance().getModuleArea().find('#bd_reports_panel_right').find('#bd_tab_content #' + options.id ).html( jQ(contentHTML) );
                    },
                    setTitle: function( options ){ //{id,content}
                        AppUI.getInstance().getModuleArea().find('#bd_reports_panel_right').find('#bd_nav_tab [href="#'+options.id+'"]').find('.bd_tab_title').html( options.title );
                    },
                    getContent: function(options){
                        return AppUI.getInstance().getModuleArea().find('#bd_reports_panel_right').find('#bd_tab_content #' + options.id );
                    },
                    initTabDrop: function(){
                        jQ('.nav-tabs:last').tabdrop({text: '<span class="glyphicon glyphicon-th-list"></span>'});
                    },
                    show: function(options){
                        jQ('#bd_nav_tab  a[href="#'+options.id+'"]').tab('show');
                    },
                    execDropTab : function(){
                        console.log('Resized..');
                        jQ('.nav-tabs').tabdrop('layout');
                    }
                }
            },
            SideBar: function(){
                return {
                    toggle : function(){
                        var _this = AppUI.getInstance().getModuleArea().find('#bd_reports_panel_right').find('.bd_collapse_sidebar');
                        if( jQ(_this).hasClass('glyphicon-arrow-left')){
                            jQ(_this).removeClass('glyphicon-arrow-left');
                            jQ(_this).addClass('glyphicon-arrow-right')

                            AppUI.getInstance().getModuleArea().find('#bd_reports_panel_right').removeClass('col-sm-10');
                            AppUI.getInstance().getModuleArea().find('#bd_reports_panel_right').addClass('col-sm-12');
                        }else{
                            AppUI.getInstance().getModuleArea().find('#bd_reports_panel_right').addClass('col-sm-10');
                            AppUI.getInstance().getModuleArea().find('#bd_reports_panel_right').removeClass('col-sm-12');

                            jQ(_this).removeClass('glyphicon-arrow-right');
                            jQ(_this).addClass('glyphicon-arrow-left');

                        }

                        AppUI.getInstance().getModuleArea().find('#bd_reports_panel_left').toggle();
                    },
                    collapseEvent: function(){
                        AppUI.getInstance().getModuleArea().find('#bd_reports_panel_right').on('click','.bd_collapse_sidebar',function(){
                            AppUI.getInstance().SideBar().toggle();
                            jQ('.nav-tabs').tabdrop('layout');
                        });
                    }
                }
            },
            Layout: function(){
                return {
                    makeDraggable: function(selector){
                        jQ(selector).resizable({
                            "handles" : 'w,e'
                        });
                    },
                    Events: function(){
                        return{
                            handle: function(eventName){
                                for( var i in _layoutEventHandlers[eventName] ){
                                    var evF = _layoutEventHandlers[eventName][i];
                                    if( 'funciton' === typeof evF ) evF();
                                }
                            },
                            addHandler: function(event, func ){
                                _layoutEventHandlers[event].push(func);
                            }
                        }
                    }
                };
            },
            Alerts: function(options){
            	if(typeof options == 'undefined' ) options = {};
                return {
                    Success: function(message){
                    	if( typeof options.close != 'undefined' ) { 
                    		if ( options.close == true ){
                    			message += '<a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>';
                    		}
                    	}
                        var html =   '<div class="alert alert-success alert-dismissible " role="alert">'+ message +'</div>';
                        return html;
                    },
                    Info: function(message){
                    	if( typeof options.close != 'undefined' ) { 
                    		if ( options.close == true ){
                    			message += '<a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>';
                    		}
                    	}
                        var html =   '<div class="alert alert-info alert-dismissible " role="alert">' + message + '</div>';
                        return html;
                    },
                    Warning: function(message){
                    	if( typeof options.close != 'undefined' ) { 
                    		if ( options.close == true ){
                    			message += '<a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>';
                    		}
                    	}
                        var html =   '<div class="alert alert-warning alert-dismissible " role="alert">' + message + '</div>';
                        return html;
                    },
                    Error: function(message){
                    	if( typeof options.close != 'undefined' ) { 
                    		if ( options.close == true ){
                    			message += '<a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>';
                    		}
                    	}
                        var html =   '<div class="alert alert-danger alert-dismissible " role="alert">' + message + '</div>';
                        return html;
                    }
                }
            }
        }
    }
        
    return {
        getInstance: function(){
            if (!ui_instance) {
                ui_instance = _createInstance();
            }
            return ui_instance;
        },
        I: function(){
            return AppUI.getInstance();
        }
    };
})(jQuery,window);

module.exports = AppUI;