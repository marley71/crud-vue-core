
<script>
import _wBase from './_wBase.vue'
import jQuery from "jquery";
import Server from "../../utility/Server";

export default {
    name: "_wUploadAjax",
    extends: _wBase,
    data() {
        return {
            extensions: [],
            maxFileSize: '',
            routeName: 'uploadfile',
            value: {},
            error: false,
            errorMessage: '',
            previewConf: {
                value: {},
            },
            json:null,
        }
    },
    mounted() {
        var that = this;
        var conf = that._getConf();
        that.previewConf.cRef = that.uid + 'preview';
        if (that.value instanceof Object) {
            that.previewConf.value = that.value;
            that.previewConf.iconSize = 'fa fa-2x';
            that.value = JSON.stringify(that.value).replace(/\\"/g, '"');
        }
        else if (!that.value) {
            that.value = {};
        }
    },
    methods: {

        // _dynamicData(conf) {
        //     console.log('wUploadAjaxMixin',conf.value);
        //     conf.previewConf.cRef = this._uid + 'preview';
        //     if (conf.value instanceof Object) {
        //         conf.previewConf.value = conf.value;
        //         conf.previewConf.iconSize = 'fa fa-2x';
        //         conf.value = JSON.stringify(conf.value).replace(/\\"/g, '"');
        //     }
        //     else if (!this.value) {
        //         conf.value = {};
        //     }
        //     return conf;
        // },
        getPreviewConf: function () {
            return this.previewConf;
        },

        setRouteValues: function (route) {
            route.setValues({
                modelName: this.modelName
            })
            return route;
        },
        _getFileValue: function () {
            var that = this;
            console.log('filedesc', that.jQe().find('[c-file]').prop('files'));
            var fileDesc = that.jQe().find('[c-file]').prop('files');
            if (fileDesc.length) {
                return fileDesc[0];
            }
            return null;
        },
        _validate: function () {
            return true;
        },
        validate: function () {
            var that = this;
            //TODO eseguire validazione
            console.log('validate');
            that.change();
            if (that._validate()) {
                that.sendAjax();
            }

        },
        onSuccess() {
            console.log('onSuccess _wUploadAjax');
        },
        onError() {
            console.log('onError _wUploadAjax');
        },
        sendAjax: function () {
            var that = this;
            var fDesc = that._getFileValue();
            if (!fDesc)
                throw 'descrittore file upload non valido';
            // var fileName = fDesc.filename;
            var route = that._getRoute();
            that.setRouteValues(route);
            that.error = false;
            that.complete = false;

            var realUrl = Server.getUrl(route.getUrl());
            console.log('realurl', route.getUrl())
            var fdata = new FormData();
            //data.append('file',jQuery(that.$el).find('[c-image-file]').prop('files')[0]);
            fdata.append('file', fDesc)
            console.log('ajaxFields', that.ajaxFields)
            for (var k in that.ajaxFields)
                fdata.append(k, that.ajaxFields[k])

            jQuery.ajax({
                url: realUrl,
                headers: Server.getHearders(),
                type: 'POST',
                data: fdata,
                processData: false,
                contentType: false                    // Using FormData, no need to process data.
            }).done(function (data) {
                that.error = data.error;
                that.lastUpload = null;
                that.json = data;
                console.log("Success: Files sent!", data);
                if (data.error) {
                    var msg = null;
                    try {
                        var tmp = JSON.parse(data.msg);
                        msg = "";
                        for (k in tmp) {
                            msg += tmp[k] + '\n';
                        }
                    } catch (e) {
                        msg = data.msg;
                    }
                    that.errorMessage = msg;
                    //self._showError(dialog,msg);
                    jQuery(that.$el).find('[crud-button="ok"]').addClass("disabled");
                    that.value =  JSON.stringify({});
                    return;
                }
                that.$emit('success', that);
                that.complete = true;

                console.log('done, data.result', data.result);

                that.lastUpload = that.cloneObj(data.result);

                that.value = JSON.stringify(data.result); //.replace(/\\"/g, '"');
                // console.log('refs',that.$refs.preview)
                // window.PIPPO = that.$refs.preview;
                that.$refs.preview.setValue(data.result);
                // var refPreview = that._uid + 'preview';
                // that.store.cRefs[refPreview].value = data.result;
                that.onSuccess();
            }).fail(function (data, error, msg) {
                console.log("An error occurred, the files couldn't be sent!");
                that.lastUpload = false;
                that.error = true;
                that.errorMessage = "Upload error " + data + " " + error + " " + msg;
                that.value = JSON.stringify({});
                that.onError();
            });
        },
    }
}
</script>
