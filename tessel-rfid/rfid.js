/**
 * Created by chen on 2015/6/8.
 */
// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
 This basic RFID example listens for an RFID
 device to come within range of the module,
 then logs its UID to the console.
 *********************************************/

var tessel = require('tessel');
var rfidlib = require('rfid-pn532');
var rfid = rfidlib.use(tessel.port['D']);
var getState = require('./fsm').getState;
var setState = require('./fsm').setState;
var sendRFIDByNrf = require('./nrf24_Tx').sendRFIDByNrf;

var uid;

rfid.on('ready', function (version) {
    console.log('Ready to read RFID card');

    rfid.on('data', function(card) {
        console.log('UID:', card.uid);
        //console.log('UID:', card.uid.toString('hex'));
        uid = card.uid;
        var state = getState();
        switch (state) {
            case 0:
                //sendRFIDByNrf(card.uid);
                break;
            case 1:
                //sendRFIDByHttp();
                setState(0);
                break;
            default:
                console.log('Error: Unknown tessel-rfid state!')
        }
    });
});

rfid.on('error', function (err) {
    console.error(err);
});

exports.getUid = function() {
    return uid;
};