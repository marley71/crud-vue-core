import jQuery from 'jquery'
import Route from '../utility/Routes'
import { createApp } from 'vue'
import crudVars from '../utility/crudVars';


const coreMixin = {
    methods : {

        newComponent(name,rootProps) {
            //var store = this.store;
            let store = crudVars;
            var rP = rootProps || {};
            //console.log('store',store,'app',store.app,store.app.component(name))
            var comp = createApp(store.app.component(name),rP);
            for (let k in store.app._context.components) {
                comp.component(k,store.app.component(k));
            }
            for (let k in store.app._context.directives) {
                comp.directive(k,store.app._context.directives[k]);
            }
            for (let k in store.app._context.provides) {
                comp.directive(k,store.app._context.provides[k]);
            }
            console.log('newComponent use',store.use);
            for (let i in store.use) {
                comp.use.apply(this,store.use[i]);
            }
            return comp;
        },

        lining : function (text,maxLength,char) {
            if (!text) {
                return "";
            }
            char = char || " ";
            maxLength= maxLength || 40;

            var indTokens = text.split(char);
            var textSpaced = '';
            var currLength = 0;
            for (var i in indTokens) {
                var token = indTokens[i];
                textSpaced += token;
                currLength += token.length;
                if (currLength >= maxLength) {
                    textSpaced += "<br/>";
                    currLength = 0;
                } else {
                    textSpaced += "&nbsp;";
                }
            }
            return textSpaced;
        },


        // createComponent(name,fileName,callback) {
        //     var _cb = callback?callback:function (){};
        //     this._newComponent(name,fileName,_cb);
        // },
        getHashParams () {
            var params = {};
            var hash = window.location.hash || "";
            var tmp = hash.split('?');
            if (tmp.length != 2)
                return params;
            var paramsArray = tmp[1].split('&');
            for ( var i in paramsArray) {
                tmp = paramsArray[i].split("=");
                if (tmp.length == 2) {
                    params[tmp[0]] = tmp[1];
                }
            }
            return params;
        },
        getHashParam (name) {
            var params = this.getHashParams();
            return params[name];
        },
        getComponent : function (refId) {
            return this.$refs[refId];
            // var store = this.store;
            // return store.cRefs[refId];
        },
        waitStart : function (msg,container) {
            var that = this;
            var store = this.store;
            var _c = container?container:'body';
            var id = that.createContainer(_c);
            let comp = that.newComponent('c-wait',{
                cConf : {
                    msg :msg,
                    global : (_c==='body')?true:false,
                }
            })

            // let comp = new that.$options.components['c-wait']({
            //     propsData: {
            //         cConf: {
            //             msg:msg,
            //             global :(_c==='body')?true:false,
            //         }
            //         // cMsg : msg,
            //         // cGlobal : (_c==='body')?true:false,
            //     }
            // })
            comp.mount('#'+id);
            store._wait_istances.push(comp);
            return comp;
        },
        waitEnd : function (component) {
            var that = this;
            var store = this.store;
            if (store._wait_istances.length == 0)
                return ;
            if (component) {
                for (var i in store._wait_istances) {
                    let comp =store._wait_istances[i];
                    if (comp.uid == component.uid) {
                        store._wait_istances.splice(i,1);
                    }
                }
            } else {
                let comp = store._wait_istances.pop();
                comp.unmount();
                //comp.$el.parentNode.removeChild(comp.$el);
            }
        },

        createFullscreenModal (compName,propsData,title,callbacks) {
            var that = this;
            var divId = 'd' + (new Date().getTime());
            var cDef = that.dynamicComponent(compName);
            var dialogConf = {
                message : '<div id="' + divId + '"></div>',
                callbacks : callbacks,
                title : title,
                cBig : true,
                mounted() {
                    var thisDialog = this;
                    console.log('dialog mounted',thisDialog.jQe().html())
                    thisDialog.jQe('.modal-dialog').addClass('modal-full');
                    var dialogComp = new cDef({
                        propsData: propsData
                    });
                    dialogComp.$mount(thisDialog.jQe('#'+divId)[0]);
                    thisDialog.component = dialogComp;
                }
            }
            var d =  that.customDialog(dialogConf);
            return d;
        },

        createModalView : function(viewName,propsData,title,callbacks) {
            var that = this;
            var divId = 'd' + (new Date().getTime());
            var dialogConf = {
                message : '<div id="' + divId + '">uuuu</div>',
                callbacks : callbacks,
                title : title,
                mounted() {
                    var thisDialog = this;
                    console.log('dialog mounted',thisDialog.jQe().html())
                    var dialogComp = new that.$options.components[viewName]({
                        propsData: propsData
                    });
                    thisDialog.component = dialogComp;
                    dialogComp.$mount(thisDialog.jQe('#'+divId)[0]);
                }
            }
            var d =  that.customDialog(dialogConf);
            return d;
        },
        createBigModalView : function(viewName,propsData,title,callbacks) {
            var that = this;

            var divId = 'd' + (new Date().getTime());
            var dialogComp = new that.$options.components[viewName]({
                propsData: propsData
            });
            var _cbs = callbacks?callbacks:{};
            /*
            {
                    chiudi: function () {
                        dialogComp.$destroy();
                        this.hide();
                    }
                }
             */
            // creo la dialog custom
            var dialog = that.customDialog({
                cContent: '<div id="' + divId + '"></div>',
                cTitle: title,
                cBig : true,
                cCallbacks: _cbs,
            });
            // visualizzo la view
            dialogComp.$mount('#' + divId);
            dialog.componentInstance = dialogComp
            return dialog;
        },
        createContainer : function (container,overwrite) {
            var id= 'd' + (new Date().getTime());
            if (overwrite)
                jQuery(container).html('<div id="'+id+'" ></div>');
            else
                jQuery(container).append('<div id="'+id+'" ></div>');
            return id;
        },
        /**
         * instanzia un componente e lo mostra nel container passato
         *
         * @param container
         * @param compName
         * @param conf
         */
        // showComponent : function(container,compName,propsData) {
        //     var cDef = this.dynamicComponent(compName);
        //     var comp = new cDef({
        //         propsData: propsData
        //     });
        //     var idC = this.createContainer(container);
        //     comp.$mount(window.jQuery('#'+idC)[0]);
        //     return comp;
        // },

        /**
         * ritorna la traduzione della chiave passata presente nel vettore $lang altrimenti ritorna al chiave stessa
         * @param key
         * @param plural
         * @param params
         * @returns {*}
         */
        translate : function (key,context,plural,params) {
            var langKey = context ? context + '.' + key : key
            return this._translate(langKey, plural, params)

            //return this._translate(key,plural,params);
            //return translations_interface._translate.apply(this,[key,plural,params]);
        },
        /**
         * esegue la traduzione solo se esiste la chiave corrispondente nel vettore $lang
         * @param key
         * @param plural
         * @param params
         * @returns {string|*}
         */
        hasTranslation : function (key) {
            let store = crudVars;
            if (store.lang[key])
                return true;
            return false;
        },

        _translate : function (key,plural,params) {
            let store = crudVars;
            console.log('_translate store',key,store.lang[key]);
            var testi = store.lang[key];
            if (!testi)
                return key;
            testi = testi.split('|');
            var testo = (plural && testi.length>1)?testi[1]:testi[0];
            //console.log('testi',testi);
            if (params instanceof Array) {
                for (var i = 0; i < params.length; i++) {
                    testo= testo.replace("(" + i +")", params[i] );
                }
            }
            return testo;
        },
        /**
         * istanzia una nuova route a partire dalla configurazione trovata in store
         * @param routeName : nome della configurazione della route
         */
        createRoute : function(routeName) {
            let store = crudVars;
            let routeConf = store.routes[routeName];
            console.log('routeName',routeName,routeConf);
            if (!routeConf)
                throw "Impossibile trovare la route " + routeName;
            return new Route(routeConf);
        },

        createRouteFromConf : function(routeConf) {
            return new Route(routeConf);
        },

        /**
         * cerca e crea la classe protocol utilizzando come naming
         * Protocol+pascalCase(name)
         * @param name : nome su cui viene applicata la funzione pascalCase e aggiunt il prefisso Protocol.
         * esempio se passiamo come nome mio_prot cerchera' di istanziare la class ProtocolMioProt.
         */
        createProtocol : function(name) {
            let store = crudVars;
            let className = "Protocol" + this.pascalCase(name);
            try {
                //return new window[className]();
                //return eval('new ' + className + '()');

                return new store.protocols[name]();
            } catch (e) {
                console.error('failed to create ' + className,e);
            }
        },

        getDescendantProp : function(obj, desc) {
            console.log('getDescendantProp',desc,obj);
            var arr = desc.split(".");
            while(arr.length && (obj = obj[arr.shift()]));
            return obj;
        },

        // getFormData : function (form) {
        //     var that = this;
        //     if (form && form.length === 0) {
        //         console.error('form not found!');
        //         return {};
        //     }
        //     if (typeof window.tinyMCE !== 'undefined') {
        //         window.tinyMCE.triggerSave();
        //     }
        //     var serializedData = window.jQuery(form).serialize();
        //     serializedData = serializedData.split('&');
        //
        //     var formData = new FormData();
        //     for (var i in serializedData) {
        //         var tmp = serializedData[i].split('=');
        //         formData.append(tmp[0],tmp[1]);
        //     }
        //     // check upload object
        //     jQuery.each(form.find('input[type="file"]'),function () {
        //         var files = jQuery(this)[0].files
        //         for (var f=0;f<files.length;f++) {
        //             formData.append(jQuery(this).attr('name'),files[f]);
        //         }
        //     })
        //     console.log('getFormData',formData instanceof FormData)
        //     return formData;
        // },


        getFormData : function (form) {

            var _serializeAssoc = function (form) {
                var ss = form.serializeArray();
                var data = {};
                for (var i in ss) {
                    var key = ss[i].name;
                    var value = ss[i].value;
                    if (key.indexOf('[') >= 0) {
                        if (!data[key])
                            data[key] = [];
                        data[key].push(value);
                    } else {
                        data[key] = value;
                    }
                }
                return data;
            }




            //var form = that.jQe('form[name="data_form"]');
            if (form && form.length === 0) {
                console.error('form not found!');
                return {};
            }
            if (typeof window.tinyMCE !== 'undefined') {
                window.tinyMCE.triggerSave();
            }
            var serializedData =  _serializeAssoc(form);//form.serializeAssoc();
            var postData = {}
            console.log('serializedData',serializedData)
            // trasformo tutti gli [d] in [] questa modifica e' fatta per gestire i radio button negli hasmany
            // altrimenti venivano raggruppati come un unica entita'
            for( var k in serializedData) {
                if (serializedData[k].constructor !== Array) {
                    postData[k] = serializedData[k];
                    continue;
                }
                var pattern = /(.+)(\[\d+\])(.*)$/g;
                var match = pattern.exec(k);
                if (match && match.length == 4) {
                    var newkey = match[1] + '[]' + match[3];
                    if (!postData[newkey])
                        postData[newkey] = [];
                    postData[newkey].push(serializedData[k]);
                    delete serializedData[k];
                } else {
                    postData[k] = serializedData[k];
                }
            }
            console.log('postData',postData);
            var formData = new FormData();
            for(var f in postData) {
                if (postData[f] instanceof Array) {
                    for (var cc in postData[f]) {
                        formData.append(f,postData[f][cc])
                    }
                } else
                    formData.append(f,postData[f]);
            }
            // check upload object
            jQuery.each(form.find('input[type="file"]'),function () {
                var files = jQuery(this)[0].files
                for (var f=0;f<files.length;f++) {
                    formData.append(jQuery(this).attr('name'),files[f]);
                }
            })
            console.log('getFormData',formData instanceof FormData)
            return formData;
        },

        // funzioni trasformazioni standard case
        sentenceCase : function (str) {
            let store = crudVars;
            if (str == null) {
                return '';
            }

            return String(str)
                // Enables camel case support.
                .replace(store._CAMEL_CASE_REGEXP, '$1 $2')
                // Add a space after any digits.
                .replace(store._TRAILING_DIGIT_REGEXP, '$1 $2')
                // Remove all non-word characters and replace with a single space.
                .replace(store._NON_WORD_REGEXP, ' ')
                // Trim whitespace around the string.
                .replace(/^ | $/g, '')
                // Finally lower case the entire string.
                .toLowerCase();
        },
        camelCase : function (string) {
            return this.sentenceCase(string)
                // Replace periods between numeric entities with an underscore.
                .replace(/(\d) (?=\d)/g, '$1_')
                // Replace spaces between words with a string upper cased character.
                .replace(/ (\w)/g, function (_, $1) {
                    return $1.toUpperCase();
                });
        },
        costantCase : function (string) {
            return this.snakeCase(string).toUpperCase();
        },
        dotCase : function (string) {
            return this.sentenceCase(string).replace(/ /g, '.');
        },
        isLowerCase : function (string) {
            return this.lowerCase(string) === string;
        },
        isUpperCase : function (string) {
            return this.upperCase(string) === string;
        },
        lowerCase : function (str) {
            var toLower = String.prototype.toLowerCase;
            return str == null ? '' : toLower.call(str);
        },
        paramCase : function (string) {
            return this.sentenceCase(string).replace(/ /g, '-');
        },
        pascalCase : function (string) {
            return this.upperCaseFirst(this.camelCase(string));
        },
        pathCase : function (string) {
            return this.sentenceCase(string).replace(/ /g, '/');
        },
        snakeCase : function (string) {
            return this.sentenceCase(string).replace(/ /g, '_');
        },
        swapCase : function (str) {
            if (str == null) {
                return '';
            }
            var result = '';
            for (var i = 0; i < str.length; i++) {
                var c = str[i];
                var u = c.toUpperCase();
                result += u === c ? c.toLowerCase() : u;
            }
            return result;
        },
        titleCase : function (string) {
            return this.sentenceCase(string).replace(/^\w| \w/g, this.upperCase);
        },
        upperCase : function (str) {
            var upperCase = String.prototype.toUpperCase;
            return str == null ? '' : upperCase.call(str);
        },
        upperCaseFirst : function (str) {
            if (str == null) {
                return '';
            }

            str = String(str);

            return str.charAt(0).toUpperCase() + str.substr(1);
        },

        cloneObj : function (obj) {
            return Array.isArray(obj)?jQuery.extend(true,[],obj):jQuery.extend(true,{},obj);
        },

        /**
         * esegue il merge di due configurazione di view rispettando i criteri di priorità e di
         * campi speciali.
         * @param obj1
         * @param obj2
         * @return {*}
         */
        mergeConfView : function(obj1,obj2) {
            var specialsKey = ['fields','fieldsConfig','actionsConfig','methods'];
            var c1 = this.cloneObj(obj1);
            //var c2 = this.cloneObj(obj2);
            let c2 = obj2;
            //console.log('c1',c1,'c2',c2);

            c1.fields = c1.fields?c1.fields:[];
            c1.fieldsConfig = c1.fieldsConfig?c1.fieldsConfig:{};
            c1.actionsConfig = c1.actionsConfig?c1.actionsConfig:{};
            //c1.actions = c1.actions?c1.actions:[];
            c1.methods = c1.methods?c1.methods:{};

            if (c2.fields)
                c1.fields = c2.fields;

            if (c2.actions) {
                c1.actions = c2.actions;
            }
            if (c2.fieldsConfig) {
                for (var k in c2.fieldsConfig) {
                    c1.fieldsConfig[k] = c2.fieldsConfig[k];
                }
            }
            if (c2.actionsConfig) {
                for (let k in c2.actionsConfig) {
                    c1.actionsConfig[k] = c2.actionsConfig[k];
                }
            }
            if (c2.methods) {
                for (let k in c2.methods) {
                    c1.methods[k] = c2.methods[k];
                }
            }

            for (let k in c2) {
                if (specialsKey.indexOf(k) >= 0)
                    continue;
                //console.log('sovrascrivo',k);
                c1[k] = c2[k];
            }
            return c1;
        },

        mergeConf2(dest,source) {
            let specialsKey = ['methods'];
            let c1 = this.cloneObj(dest);
            let c2 = source || {}; //this.cloneObj(source);
            //console.log('c1',c1,'c2',c2);
            let methods = c2.methods || {};
            if (methods) {
                c1.methods = c1.methods || {};
                for (let k in methods) {
                    c1.methods[k] = methods[k];
                }
            }

            for (let k in c2) {
                //console.log('merge2',k);
                if (specialsKey.indexOf(k) >= 0)
                    continue;
                //console.log('sovrascrivo',k);
                c1[k] = c2[k];
            }
            //console.log('c1',c1);
            return c1;
        },

        /**
         * esegue il merge di una configurazione risalendo la property confParent.
         * @param conf
         * @return {*}
         */
        mergeConf : function(conf,rootData) {
            let that = this;
            let store = crudVars;
            //console.log('Merge Conf',conf);

            var __getConfObj = function (c,rD) {
                let _conf = c;
                if (typeof c === 'string' || c instanceof String) {
                    _conf = that.getDescendantProp(rD, c);
                }
                return _conf || {};
            }

            var _rD = rootData || store.conf;
            //console.log('_rD',_rD,'conf',conf);
            var _c = __getConfObj(conf,_rD);
            var _parents = [];
            _parents.push(_c)

            while(_c){
                //console.log('parent',_c.confParent);
                if (_c.confParent) {
                    _c = __getConfObj(_c.confParent,store.conf);
                    _parents.push(_c);
                } else {
                    _parents.push(_c);
                    _c = null;
                }
            }

            var finalConf = {};
            //console.log('conf gerarchia parents',_parents);
            for (var i=_parents.length-1;i>=0;i--) {
                //console.log('i',i);
                finalConf = this.merge(finalConf,_parents[i]);
            }
            //console.log('Merge FINAL CONF',finalConf,_parents)
            return finalConf;
        },

        merge : function(obj1, obj2) {
            return jQuery.extend(true,{},obj1,obj2);
        },

        /**
         * ritorna i parametri sotto forma di vettore associativo di un url o altrimenti di location.search
         * @param url
         */
        getAllUrlParams : function (url) {
            var params = {};
            var tmp = url?url.split('?'):location.href.split("?");


            if (tmp.length != 2)
                return params
            var sparams = tmp[1].split("&");
            for(var i in sparams) {
                let tmp = sparams[i].split("=");
                if (tmp.length != 2)
                    continue;
                var name = tmp[0];
                var value = tmp[1];
                if (name.indexOf('[]') >= 0) {
                    if (!params[name])
                        params[name] = [];
                    params[name].push(decodeURIComponent(value) )
                } else {
                    params[name] = decodeURIComponent(value);
                }

            }
            //console.log('getAllUrlParams',url,params);
            return params;

        },


        /**
         * carica un vettore di risorse, al fine caricamento chiama la callback
         * @param resources
         * @param callback
         */
        loadResources : function(resources, callback) {
            var that = this;
            var _callback = callback?callback:function () {};
            if (!resources || resources.length == 0) {
                _callback();
                return ;
            }

            var _recursive = function (i) {
                that.loadResource(resources[i],function () {
                    //log.info('_recursive', resources[i]);
                    if (i < resources.length-1) {
                        _recursive(i+1);
                    } else {
                        _callback();
                        return ;
                    }
                });
            }

            _recursive(0);
        },
        /**
         * carica una risorsa script o css dinamicamente partendo dalla cartella
         * pluginsPath quando lo script e' stato caricato chiama la callback
         * @param fileName
         * @param callback
         */
        loadResource : function (fileName, callback) {
            var store = crudVars;
            //console.log('App.loadResourece',fileName)
            var _callback = callback?callback:function () {};
            if (!fileName) {
                console.warn('App.loadResorce fileName non definito!');
                _callback();
                return ;
            }
            var re = /(?:\.([^.]+))?$/;
            var ext = re.exec(fileName)[1];
            var realPath = fileName;
            if (fileName.indexOf('http') != 0) {
                realPath = ( (fileName.charAt(0) == '/') || (fileName.indexOf('../') === 0) || (fileName.indexOf('./') === 0)) ? fileName : store.pluginsPath + fileName;
            }
            if (ext == 'js') {
                this._loadScript(realPath,_callback);
            } else if (ext == 'css') {
                this._loadCss(realPath,_callback);
            } else if (ext == 'html') {
                this._loadHtml(realPath,_callback);
            } else {
                throw 'invalid extension ' + ext + ", filename: " + fileName;
            }
        },
        getRefId : function () {
            var id = "";
            for (var i = 0; i < arguments.length; i++) {
                id += arguments[i];
                if (i < arguments.length-1)
                    id += '-';
            }
            return id;
        },
        _loadHtml  : function (fileName,callback) {
            let store = crudVars;
            let _callback = function () {
                //that.log.info('loaded... ' + scriptName);
                store._resources[fileName] = true;
                store._resources_loaded[fileName] = true;
                if (callback) {
                    callback();
                }
            }
            if (!store._resources[fileName]) {
                jQuery.get(fileName,function (html) {
                    jQuery('body').append(html);
                    callback();
                }).fail(function (e) {
                    throw 'load ' + fileName + ' failed! ' + e;
                });
            } else {
                return _callback();
            }
        },
        _loadScript : function (scriptName, callback) {
            let store = crudVars;
            var _callback = function () {
                //that.log.info('loaded... ' + scriptName)
                store._resources[scriptName] = true;
                store._resources_loaded[scriptName] = true;
                if (callback) {
                    callback();
                }
            }
            if (!store._resources[scriptName]) {
                //that.log.info('loading... ' + scriptName);

                var body 		= document.getElementsByTagName('body')[0];
                var script 		= document.createElement('script');
                script.type 	= 'text/javascript';
                script.src 		= scriptName;
                script.onload = _callback;
                script.onerror = function() {
                    console.error("cannot load script " + scriptName);
                }
                // fire the loading
                body.appendChild(script);
                //return _waitLoad(scriptName,_callback);
                return ;
            }
            callback();
        },

        _loadCss : function (scriptName,callback) {
            let store = crudVars;
            let _callback = function () {
                //that.log.info('loaded... ' + scriptName);
                store._resources[scriptName] = true;
                store._resources_loaded[scriptName] = true;
                if (callback) {
                    callback();
                }
            }
            if (!store._resources[scriptName]) {
                //that.log.info('loading... ' + scriptName);
                var body 		= document.getElementsByTagName('body')[0];
                var script 		= document.createElement('link');
                script.type 	= 'text/css';
                script.rel      = 'stylesheet';
                script.href 	= scriptName;
                script.onload = _callback;
                // fire the loading
                body.appendChild(script);
                return ;
            } else {
                return callback();
            }
        },

        // _newComponent (name,fileName,callback) {
        //     var that = this;
        //     if (store._dynamicComponents[name])
        //         return callback();
        //     console.log('carico componente',name,fileName);
        //     var route = that.createRoute('pages');
        //     var path = fileName.replaceAll('/', '.');
        //     route.setValues({
        //         path: path
        //     })
        //     var params = {};
        //     route.setParams(params);
        //     Server.route(route, function (html) {
        //         if (html.error) {
        //             that.errorDialog(html.msg);
        //             return callback();
        //         }
        //         var htmlNode = window.jQuery('<div>' + html + '</div>');
        //         // contiene il tag html => pagina principale
        //         if (htmlNode.find('html').length >= 1) {
        //             // console.log(htmlNode.html())
        //             throw new Error({code: 500, message: 'app.invalid-html'})
        //         }
        //         window.jQuery.each(htmlNode.find('script'), function () {
        //             // console.log('script',window.jQuery(this).text());
        //             window.jQuery('body').append(window.jQuery(this));
        //             window.jQuery(this).remove();
        //         })
        //
        //         store.conf[name] = window[that.camelCase(name)];
        //         var cDef = store.app.component(name, {
        //             extends: that.$options.components['c-component'],
        //             template: htmlNode.html()
        //         });
        //         cDef.prototype.$store = store;
        //         that.$options.components[name] = cDef;
        //
        //         store._dynamicComponents[name] = cDef;
        //         return callback();
        //     });
        // },
        /**
         * crea un componente vue per l'azione di nome name se non esiste
         * @param name nome del componente della nuova azione
         * @param actionBase azione da estendere
         * @private
         */
        // _createActionComponentOld (name,conf) {
        //     var that = this;
        //     if (!conf.componentName)
        //         throw name + " questa azione non contiene l'azione da estendere"
        //     // se non esiste il componente di azione lo creo al volo
        //     console.log('_createActionComponent',name,that.$options.components[name],store.app.component(name));
        //     if (!that.$options.components[name]) {
        //         // if (store.conf[name] && store.conf[name].confParent) {
        //         //     aClassName = store.conf[name].confParent
        //         // }
        //         //console.log(aClassName,'non esiste la creao',name,that.$options.components[aClassName])
        //         that.$options.components[name] = store.app.component(name, {
        //             extends: that.$options.components[conf.componentName]
        //         });
        //         that.$options.components[name].store = store;
        //     }
        // },
        // _createActionComponent (name,conf) {
        //     var that = this;
        //     if (!conf.componentName)
        //         throw name + " questa azione non contiene l'azione da estendere"
        //     // se non esiste il componente di azione lo creo al volo
        //
        //     // if (!store.app.component(name)) {
        //     //     console.log('CREATO');
        //     //     store.app.component(name,{
        //     //         extends : conf.componentName
        //     //     })
        //     // }
        //     // console.log('_createActionComponent',name,store.app.component(name));
        // },
        /**
         * istanzia l'oggetto route definito da routeName nella configurazione altrimenti ritorna null
         * @param routeName : nome della route se null la prende dalla proprieta routeName del componente
         * @return {null}
         * @private
         */
        _getRoute : function (routeName) {
            var that = this;
            if (that.route)
                return that.route;
            var rn = routeName?routeName:that.routeName;
            if (!rn)
                return null;
            return that.createRoute(rn);
        },
    }
}

export default coreMixin
