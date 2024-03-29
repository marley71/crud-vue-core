
import {createApp } from 'vue';
//import crudStore from "../utility/crudStore";
//const store = crudStore();

const dialogsMixin = {
    methods : {
        __dialog(name,bodyProps,callbacks) {
            var that = this;
            //const store = crudStore();
            var store = this.store;
            console.log('_dialogMixin',store);
            var cConf = {};
            console.log('bodyProps',bodyProps,callbacks);
            if (typeof bodyProps === 'string' || bodyProps instanceof String || bodyProps instanceof Array) {
                cConf.message = bodyProps;
            } else
                cConf = bodyProps;
            if (callbacks)
                cConf.callbacks = callbacks;

            var id= 'd' + (new Date().getTime());
            cConf.cRef = id;
            window.jQuery('body').append('<div id="'+id+'"></div>');
            //console.log('component',name,store._app.component(name))
            // var dlg = createApp(store.app.component(name),{
            //     cConf:cConf
            // });
            var dlg = that.newComponent(name,{ cConf : cConf});
            dlg.store = store;
            //dlg.component(store._app.component(name))
            dlg.mount('#' + id);
            window.DD = dlg;
            console.log('dlg',dlg);
            //store.cRefs[id].show();
            return store.cRefs[id];
        },
        messageDialog : function (bodyProps,callbacks) {
            return this.__dialog('d-message',bodyProps,callbacks);
        },
        errorDialog : function (bodyProps,callbacks) {
            return this.__dialog('d-error',bodyProps,callbacks);
        },

        confirmDialog : function (bodyProps,callbacks) {
            return this.__dialog('d-confirm',bodyProps,callbacks);
        },

        warningDialog : function (bodyProps,callbacks) {
            return this.__dialog('d-warning',bodyProps,callbacks);
        },

        customDialog : function (bodyProps,callbacks) {
            return this.__dialog('d-custom',bodyProps,callbacks);
        },

        alert : function (message,classes,time) {
            return this._alert(message,classes,time);
        },

        alertSuccess : function (message,time) {
            return this._alert(message,'d-alert-success',time);
        },
        alertError : function (message,time) {
            //return this._alert(message,'alert alert-danger',time);
            return this._alert(message,'d-alert-error',time);
        },
        alertInfo : function (message,time) {
            return this._alert(message,'d-alert-info',time);
        },
        alertWarning : function (message,time) {
            return this._alert(message,'d-alert-warning',time);
        },

        _alert : function (message,alertComp,time) {
            var that = this;
            //const store = crudStore();
            var store = this.store;
            console.log('_alert',message,alertComp,time);
            var id= 'pop' + (new Date().getTime());
            var d = that.newComponent(alertComp,{
                cMessage : message,
                cTime : time,
                cConf : {
                    cRef : id,
                }
            });
            window.jQuery('body').append('<div id="'+id+'"></div>');
            d.mount('#'+id);
            //d.show();
            //window.jQuery('#'+id).popover('show');
            return store.cRefs[id];
            // var props = {
            //     cMessage : message,
            //     cClasses : classes,
            // }
            // if (time)
            //     props.cTime = time;
            // var d = new that.$options.components['d-alert']({
            //     propsData : props,
            //     //methods : callbacks,
            // });
            // var id= 'd' + (new Date().getTime());
            // window.jQuery('body').append('<div id="'+id+'"></div>');
            // d.$mount('#'+id);
            // return d;
        },
        popover : function (element,content,title) {
            window.jQuery(element).popover({
                html : true,
                content : content,
                title : title,
                trigger : 'click'

            });
            window.jQuery(element).popover('show');
            window.jQuery(element).click(function () {
                console.log('aaaa');
                window.jQuery(element).popover('hide');
            })
        }
    }
}
export default dialogsMixin
