import crud from "../../../crud";

crud.conf['w-date-picker'] = {
    resources: [
        'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/datepicker/1.0.10/datepicker.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/datepicker/1.0.10/datepicker.min.css'
    ],
    displayFormat: 'dd/mm/yyyy',
    dateFormat: 'yyyy-mm-dd',
    cPicker: null,
    buttonClear: true,
}

const wDatePickerMixin = {
    methods: {
        afterLoadResources: function () {
            var that = this
            that.cPicker = window.jQuery(that.$el).find('[c-picker]');
            that.cPicker.datepicker({
                format: that.displayFormat,
            }).on('change', function (ev) {
                var d = that.cPicker.datepicker('getDate');
                //console.log('date change',d);
                that.value = moment(d.toISOString()).format(that.dateFormat.toUpperCase()) // ev.date.toISOString();
                that.jQe('input[name="'+that.getFieldName()+'"]').val(that.value);
                that.change();
            })

            // console.log('dateformat', that.dateFormat.toUpperCase())
            //window.jQuery(that.$el).find('[c-picker]').datepicker('update', moment(that.value).format(that.displayFormat.toUpperCase()))
            that.cPicker.datepicker('update', moment(that.value).format(that.displayFormat.toUpperCase()))

            if (that.value) {
                var d = moment(that.value).toDate()
                //window.jQuery(that.$el).find('[c-picker]').datepicker('setDate', d)
                that.cPicker.datepicker('setDate', d)
            }
        },
        reset () {
            var that = this
            that.cPicker.datepicker('reset');
            that.value = '';
        }
    }
}
export default wDatePickerMixin
