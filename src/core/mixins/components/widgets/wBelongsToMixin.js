import crud from "../../../crud";

crud.conf['w-belongsto'] = {
    labelFields: ['text']
}

const wBelongsToMixin = {
    methods: {
        getFieldName: function () {
            return this.name + '[]'
        }
    }
}
export default wBelongsToMixin
