/**
 * Created by derek on 2015/6/15.
 */
var nohm = require('nohm').Nohm;

module.exports = nohm.model('Rfid', {
    idGenerator: 'increment',
    properties: {
        rfid: {
            type: 'string',
            unique: true,
            validations: [
                'notEmpty',
                ['length', {
                    min: 8,
                    max: 8
                }]
            ]
        },
        permission: {
            type: 'integer',
            index: true,
            defaultValue: 2
        },
        pictures: {
            type: 'json',
            defaultValue: []
        },
        creationTime: {
            type: 'string',
            defaultValue: new Date().toString()
        }
    },
    methods: {
        fill: function (data, fields, fieldCheck) {
            var props = {},
                self = this,
                doFieldCheck = typeof(fieldCheck) === 'function';

            fields = Array.isArray(fields) ? fields : Object.keys(data);

            fields.forEach(function (i) {
                var fieldCheckResult;

                if (doFieldCheck)
                    fieldCheckResult = fieldCheck(i, data[i]);

                if (doFieldCheck && fieldCheckResult === false)
                    return;
                else if (doFieldCheck && typeof (fieldCheckResult) !== 'undefined' &&
                    fieldCheckResult !== true)
                    return (props[i] = fieldCheckResult);


                props[i] = data[i];
            });

            this.p(props);
            return props;
        },
        store: function (data, callback) {
            var self = this;

            this.fill(data);
            this.save(function () {
                callback.apply(self, Array.prototype.slice.call(arguments, 0));
            });
        },
        allProperties: function (stringify) {
            var props = this._super_allProperties.call(this);
            return stringify ? JSON.stringify(props) : props;
        }
    }
});