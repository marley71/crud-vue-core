<script>
import crudVars from '../../utility/crudVars';
export default {
    name: "_vWidget",
    props : ['cWidget'],
    data: function () {
        var that = this;
        var cw = that.cWidget || {};
        var ct = cw.template || 'tpl-base';

        // trasformo la configurazione in oggetto in caso di stringa come nome variabile della conf
        cw = that._wConf2Object(cw);
        ct = that._tplConf2Object(ct);

        var wData = {
            widgetConf : cw,
            templateConf : ct
        }
        //console.log('reactive',reactive);
        return wData;
    },
    methods: {

        getWidget() {
            return this.$refs[this.widgetConf.cRef].getWidget();
        },
        getTemplateName () {
            //console.log('cTemplate',this.templateConf.name)
            return this.templateConf.name;
        },
        _wConf2Object(cw) {
            var that = this;
            var conf = null
            cw = cw || {};

            if (typeof cw === 'string' || cw instanceof String) {
                conf = this.getDescendantProp(window, cw)
                if (!conf) {
                    conf = this.getDescendantProp(crudVars.conf, cw)
                }
            } else {
                conf = cw
            }
            return conf;
        },
        _tplConf2Object(ct) {
            var that = this;
            var tplConf = {};
            ct = ct || {};
            // check se template e' una stringa o una configurazione
            if (typeof ct === 'string' || ct instanceof String) {
                //console.log('istanza di una stringa ',conf.template)
                tplConf.name = ct
            } else if (ct instanceof Object) {
                //console.log('NON istanza di una stringa ',conf.template)
                tplConf = ct;
            }
            return tplConf;
        }
    }
}
</script>

<style scoped>

</style>
