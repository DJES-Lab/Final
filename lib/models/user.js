/**
 * Created by derek on 2015/3/26.
 */
var nohm = require('nohm').Nohm,
    crypto = require('crypto');

var hasher = function hasher(password, salt) {
    var hash = crypto.createHash('sha512');
    hash.update(password);
    hash.update(salt);
    return hash.digest('base64');
};

var uid = function uid() {
    return ((Date.now() & 0x7fff).toString(32) + (0x100000000 * Math.random()).toString(32));
};

var password_minlength = 5;

module.exports = nohm.model('User', {
    idGenerator: 'increment',
    properties: {
        username: {
            type: 'string',
            unique: true,
            validations: [
                'notEmpty',
                ['length', {
                    min: 4
                }]
            ]
        },
        password: {
            load_pure: true,
            type: function(value, key, old) {
                var pwd, salt,
                    valueDefined = value && typeof(value.length !== 'undefined');
                if (valueDefined && value.length >= password_minlength) {
                    pwd = hasher(value, this.p('salt'));
                    if (pwd !== old) {
                        salt = uid();
                        this.p('salt', salt);
                        pwd = hasher(value, salt);
                    }
                    return pwd;
                } else {
                    return value;
                }
            },
            validations: [
                'notEmpty',
                ['length', {
                    min: password_minlength
                }]
            ]
        },
        prifiles: {
            type: 'json',
            defaultValue: []
        },
        activeProfile: {
            type: 'string',
            defaultValue: ''
        },
        rfids: {
            type: 'json',
            defaultValue: []
        },
        salt: {
            defaultValue: uid()
        }
    },
    methods: {
        authenticate: function(password) {
            return password && password != '' && this.p('password') === hasher(password, this.p('salt'));
        },
        fill: function (data, fields, fieldCheck) {
            var props = {},
                self = this,
                doFieldCheck = typeof(fieldCheck) === 'function';

            fields = Array.isArray(fields) ? fields : Object.keys(data);

            fields.forEach(function (i) {
                var fieldCheckResult;

                if (i === 'salt' || // make sure the salt isn't overwritten
                    ! self.properties.hasOwnProperty(i))
                    return;

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
                delete self.errors.salt;
                callback.apply(self, Array.prototype.slice.call(arguments, 0));
            });
        },
        checkProperties: function (data, fields, callback) {
            callback = typeof(fields) === 'function' ? fields : callback;

            this.fill(data, fields);
            this.valid(false, false, callback);
        },
        allProperties: function (stringify) {
            var props = this._super_allProperties.call(this);
            delete props.password;
            delete props.salt;
            return stringify ? JSON.stringify(props) : props;
        }
    }
});