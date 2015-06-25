/**
 * Created by derek on 2015/6/22.
 */
var config = require('../config/config');

exports.errorHandler = function(err) {
    if (err instanceof Error) {
        if (err.name == 'RequestError') {
            return {
                type: 'TIMEOUT',
                message: 'RFID request timeout: ' + config.tesselRfid.timeout / 1000 + ' seconds'
            };
        } else {
            return {
                type: 'INTERNAL',
                message: err.message
            };
        }
    } else if (err instanceof Object){
        if (err.type && err.message) {
            return err;
        } else if (err.toString) {
            return {
                type: 'OTHER',
                message: err.toString()
            };
        } else {
            return {
                type: 'OTHER',
                message: JSON.stringify(err)
            };
        }
    } else {
        return {
            type: 'INTERNAL',
            message: err
        };
    }
};