/**
 * Created by derek on 2015/6/22.
 */
var config = require('../config/config');

exports.errorHandler = function(err, timeoutType) {
    if (err instanceof Error) {
        if (err.name == 'RequestError') {
            if (timeoutType == 'rfid') {
                return {
                    type: 'TIMEOUT',
                    message: 'RFID request timeout: ' + config.tesselRfid.timeout / 1000 + ' seconds'
                };
            } else if (timeoutType == 'newProfile') {
                return {
                    type: 'TIMEOUT',
                    message: 'Add new profile timeout: ' + config.tesselCamera.timeout / 1000 + ' seconds'
                };
            } else {
                return {
                    type: 'TIMEOUT',
                    message: 'Server timeout'
                };
            }
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