
<script>
import _wB2Select2 from './_wB2Select2.vue'
export default {
    name: "_wB2mSelect2",
    extends: _wB2Select2,
    data() {
        return {
            value : [],
        }
    },
    methods: {

        reset: function () {
            if (this.defaultValue)
                this.value = this.defaultValue;
            else
                this.value = [];
        },

        getFieldName: function () {
            return this.name + '[]';
        },

        _connectEvents: function () {
            var that = this;
            that.jQe('[c-select2]').on('select2:select', function (e) {
                //that._renderHidden();
                that.change(e);

            });
            that.jQe('[c-select2]').on('select2:unselect', function (e) {
                //that._renderHidden();
                that.change(e);
            });
        },

        getValue: function () {
            var that = this;
            console.log('b2m getValue')
            var selValues = that.jQe('[c-select2]').select2('data');
            //console.log('selValues',selValues);
            var values = [];
            for (var i in selValues) {
                values.push(selValues[i][that.primaryKey]);
            }
            //console.log('values',values);
            return values;
        },

        _getDataValues: function () {
            var that = this;
            var data = that.data || [];
            var value = that.value || [];
            for (var j in data) {
                //console.log('test',that.value[i],data[j][that.primaryKey])
                data[j].id = data[j][that.primaryKey];
                data[j].text = that.getLabel(data[j]);
                if (value.indexOf(data[j][that.primaryKey]) >= 0) {
                    data[j].selected = true;
                }
            }
            return data;
        }
    }
}
</script>
