
<script>
import _vRecord from './_vRecord.vue'
import jQuery from "jquery";
export default {
    name: "_vSearch",
    extends : _vRecord,
    data() {
        return {
            confParent: 'v-record',
            beforeForm: null,
            beforeActions: null,
            primaryKey: 'id',
            routeName: 'search',
            actions: ['action-search', 'action-reset'],
            fieldsConfig: {},
            actionsConfig: {},
            widgetTemplate: 'tpl-record',
            buttonsClass: null,
            prefixField: 's_',
            advancedFields: [],
        }
    },
    methods: {
        _ready() {
            var that = this
            that.jQe('form').each(function () {
                jQuery(this).find('input').keypress(function (e) {
                    // Enter pressed?
                    if (e.which === 10 || e.which === 13) {
                        var a = that.getAction('action-search')
                        a.execute()
                    }
                })
            })
        },
        getFieldName: function (key) {
            return this.prefixField?this.prefixField + key:key
        },
        setRouteValues: function (route) {
            var that = this
            console.log('route');
            if (route) {
                route.setValues({
                    modelName: that.modelName
                })
            }
            return route
        },
        /**
         * crea le configurazioni per i widgets della view
         */
        createWidgets: function () {
            var that = this;
            var keys = (that.fields && that.fields.length > 0) ? that.fields : Object.keys(that.value);
            var widgets = {};
            for (let k in keys) {
                let key = keys[k];
                widgets[key] = that._createWidgetConfig(key,that.value);
                widgets[key].cRef = that.getRefId(that.uid, 'w', key);
            }
            that.widgets = widgets;
            var adF = that.advancedFields || [];
            var adW = {};
            for (let k in adF) {
                let key = adF[k];
                adW[key] = that._createWidgetConfig(key, that.value);
                adW[key].cRef = that.getRefId(that.uid, 'w', key);
            }
            that.advancedWidgets = adW;

        }
    }

}
</script>
