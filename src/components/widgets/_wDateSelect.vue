
<script>
import _wBase from './_wBase.vue'
import moment from "moment-with-locales-es6";

export default {
    name: "_wDateSelect",
    extends: _wBase,
    data() {
        return {
            resources : ['https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.3/moment-with-locales.min.js'],
            minYear: null,
            maxYear: null
        }
    },
    methods: {
        cDay: function () {
            var that = this;
            var d = window.moment(that.value);
            var days = that._dayValues();
            var cd = {
                value: d.date() > d.daysInMonth() ? 1 : d.date(),
                domainValues: days,
                methods: {
                    change: function () {
                        that._updateSelect('day');
                    }
                }
            };
            return cd;
        },
        cMonth: function () {
            var that = this;
            var d = window.moment(that.value);
            var months = that._monthValues();
            var cm = {
                value: d.month() + 1,
                domainValues: months,
                methods: {
                    change: function () {
                        that._updateSelect('month');
                    }
                }
            };
            return cm;
        },
        cYear: function () {
            var that = this;
            var d = window.moment(that.value);
            var years = that._yearValues();
            var cy = {
                value: d.year(),
                domainValues: years,
                methods: {
                    change: function () {
                        that._updateSelect('year');
                    }
                }
            };
            return cy;
        },
        _updateSelect: function (controlChanged) {
            var that = this;
            if (!that._getValidDate()) {
                //that.errorDialog('invalid Date');

                return;
            }
            var _cday = that.$refs.day;
            var d = window.moment(that.value);
            _cday.domainValues = this._dayValues();
            _cday.domainValuesOrder = Object.keys(this._dayValues());
            _cday.value = d.date() > d.daysInMonth() ? 1 : d.date();
        },
        _getValidDate: function () {
            var that = this;
            //var s = jQuery(that.$el).find('[c-marker="year"]').val() +  "-" + jQuery(that.$el).find('[c-marker="month"]').val().padStart(2,'0')  + "-" + jQuery(that.$el).find('[c-marker="day"]').val().padStart(2,'0') ;
            var _cday = that.$refs.day;
            var _cmonth = that.$refs.month
            var _cyear = that.$refs.year;

            var sdate = _cyear.getValue() + "-" + (new String(_cmonth.getValue())).padStart(2, '0') + "-" + (new String(_cday.getValue())).padStart(2, '0');

            //console.log('validate Date',_cday,_cmonth,_cyear,sdate);
            var dds = window.moment(sdate,'YYYY-MM-DD',true);
            if (!dds.isValid()) {
                // -- perche' veniva fatto?
                // _cday.setValue(1);
                // sdate = _cyear.getValue() + "-" +  (new String(_cmonth.getValue())).padStart(2, '0') + "-" + (new String(_cday.getValue())).padStart(2, '0');
                // dds = window.moment(sdate);
                // if (!dds.isValid())
                    return false;
            }
            console.log(' valid date value',sdate);
            that.value = sdate;
            that.change();
            return true;
        },
        _dayValues: function () {
            var that = this;
            var d = window.moment(that.value);
            var days = {};
            for (let i = 1; i <= d.daysInMonth(); i++) {
                days[i] = i;
            }
            return days;
        },
        _monthValues: function () {
            var that = this;
            var months = {};
            for (let i = 1; i <= 12; i++) {
                months[i] = i;
            }
            return months;
        },
        _yearValues: function () {
            var that = this;
            var years = {};
            var d = window.moment(that.value ? that.value : that.conf.value);
            var minY = that.minYear ? that.minYear : d.year() - 5;
            var maxY = that.maxYear ? that.maxYear : d.year() + 5;
            for (let i = minY; i <= maxY; i++) {
                years[i] = i;
            }
            return years;
        }
    }
}
</script>
