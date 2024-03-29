/**
 * Classe per la gestione delle route verso il server.
 *
 */

import jQuery from "jquery"

export default function Route(conf) {

    const defaultConf =  {
        method : 'get',       // metodo della richiesta http, GET o POST
        url : '',             // url della route, puo' contenere variabili racchiusi tra {} che vengono valorizzati prima dell'utilizzo
        params : {},          //  parametri da inviare alla route
        commonParams : {},    //  parametri statici da aggiungere sempre alla chiamata
        values : {},          //  vettore associativo per sostituire i parametri per la costruzione dell'url racchiusi da {}
        protocol : null,      // tipo di protocollo da usare
        resultType : null,    // tipo di risultato, 'record' o 'list'
    };

    var _c = jQuery.extend(true,{},(conf || {}));
    var routeConf = jQuery.extend(true,{},defaultConf);

    for (var k in _c) {
        routeConf[k] = _c[k];
    }

    var _isFormData = function () {
        return (routeConf.params instanceof FormData);
    }
    /**
     * ritorna il metodo utilizzato per la richiesta al server, get o post
     * @return string
     */
    this.getMethod = function() {
        return routeConf.method;
    };
    this.setMethod = function(m) {
        routeConf.method = m;
    };
    /**
     * ritorna il metodo utilizzato per la richiesta al server, get o post
     * @return string
     */
    this.getProtocol = function() {
        return routeConf.protocol;
    };
    /**
     * ritorna url esatto valorizzando le variabili parametriche tra {} presenti nella
     * stringa url.
     * @param values: valori attuali per valorizzare le variabili se non viene passato prende
     * i valori presenti in this.values
     * @returns string url con variabili valorizzate
     */
    this.getUrl = function (values) {
        // var that = this;
        var finalUrl = routeConf.url;
        var v = values?values:routeConf.values;

        for (let key in v) {
            let find = '{'+key+'}';
            let re = new RegExp(find, 'g');
            finalUrl = finalUrl.replace(re,v[key]);
        }
        for (let key in v) {
            let find = '{'+key+'\\?'+'}';
            //console.log(finalUrl,' find' + find)
            let re = new RegExp(find, 'g');
            finalUrl = finalUrl.replace(re,v[key]);
        }
        // tolgo eventuali parametri opzionali
        let re = new RegExp('/{\\w+'+'\\?'+'}', 'g');
        finalUrl = finalUrl.replace(re,'');
        return finalUrl;
    };

    this.setUrl = function (url) {
        routeConf.url = url;
    }
    /**
     * ritorna tutti parametri passati in get o post in base al tipo di metodo della route
     * mergiando i parametri presenti in params e commonParams
     * @returns {*}
     */
    this.getParams = function() {
        // var that = this;
        if (_isFormData()) {
            for (var k in routeConf.commonParams) {
                routeConf.params.set(k,routeConf.commonParams[k]);
            }
            return routeConf.params;
        }
        return jQuery.extend(routeConf.params,routeConf.commonParams);
    };

    this.getParamsKeys = function () {
        if (_isFormData()) {
            return routeConf.params.keys();
            // var _keys = [];
            // for (var pair in routeConf.params.entries()) {
            //     _keys.push(pair[0])
            // }
            // return _keys;
        }
        return Object.keys(routeConf.params);
    };

    this.mergeParams = function (params) {
        if (params instanceof FormData) {
            for (var pair of params.entries()) {
                this.setParam(pair[0],pair[1])
            }
        } else {
            for (var k in params) {
                this.setParam(k,params[k]);
            }
        }
    }
    this.getParam = function (key) {
        if (_isFormData())
            return routeConf.params.get(key);
        return routeConf.params[key];
    }

    this.getCommonParam = function (key) {
        return routeConf.commonParams[key];
    }

    /**
     * setta  parametri passati in get o post in base al tipo di metodo della route
     * @params : vettore associativo di parametri da passare o un FormData
     * @returns void
     */
    this.setParams = function(params) {
        if (params instanceof FormData) {
            routeConf.params = params;
        } else {
            routeConf.params = {};
            for (var k in params) {
                routeConf.params[k] = params[k];
            }
        }
    };

    this.setParam = function (key,value) {
        //console.log('Route.setParam',_isFormData(),key,value);
        if (_isFormData()) {
            routeConf.params.set(key,value);
        } else {
            routeConf.params[key] = value;
        }

    }

    this.setCommonParam = function (key,value) {
        routeConf.commonParams[key] = value;
    }

    this.getValues  = function() {
        return routeConf.values;
    }

    this.setValues = function(values) {
        for (var k in values) {
            routeConf.values[k] = values[k];
        }
    }
    /**
     * ritorna le key dei parametri che devono essere valorizzati per ritornare l'url esatto
     * per esempio se url e' fatto come /pippo/{param1}/{param2} ritorna ['param1','param2']
     * return array
     */
    this.getKeys = function () {
        var self = this;
        var r = /\{\w+\}+/g;
        var keys = [];
        var tmp = false;
        do {
            tmp = r.exec(self.url);
            if (tmp) {
                var removeBrackets = tmp[0].substr(1);
                removeBrackets = removeBrackets.substr(0,removeBrackets.length-1);
                keys.push(removeBrackets);
            }
        } while(tmp)
        return keys;
    }

    this.getConf = function () {
        return routeConf;
    }

}
