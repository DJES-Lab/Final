/**
 * Created by chen on 2015/6/8.
 */
/* tessel to tessel
 * requires 2 nrf24 modules (and ideally two tessels)
 * put one tessel+nrf on "ping" mode and another one on "pong" mode
 */

var tessel = require('tessel'),
    NRF24 = require('rf-nrf24'),
    pipes = [0xF0F0F0F0E1, 0xF0F0F0F0D2],
    role = 'ping'; // swap this to pong if you want to wait for receive

var nrf = NRF24.channel(0x4c) // set the RF channel to 76. Frequency = 2400 + RF_CH [MHz] = 2476MHz
    .transmitPower('PA_MAX') // set the transmit power to max
    .dataRate('1Mbps')
    .crcBytes(2) // 2 byte CRC
    .autoRetransmit({count:15, delay:4000})
    .use(tessel.port['B']);

var getState = require('./fsm').getState;
var getUid = require('./rfid').getUid;

nrf._debug = false;

nrf.on('ready', function () {
    setTimeout(function(){
        nrf.printDetails();
    }, 5000);

    var tx = nrf.openPipe('tx', pipes[0], {autoAck: false}), // transmit address F0F0F0F0D2
        rx = nrf.openPipe('rx', pipes[1], {size: 4}); // receive address F0F0F0F0D2
    tx.on('ready', function () {
        setInterval(function(){
            var state = getState();
            if (state == 0) {
                console.log('SendingUID:', uid.toString('hex'));
                var uid = getUid();
                tx.write(uid);
            }
        }, 2000);
    });
    rx.on('data', function (d) {
        console.log("Got response back:", d);
    });
});

//exports.sendRFIDByNrf = function(uid) {
//    var tx = nrf.openPipe('tx', pipes[0], {autoAck: false}), // transmit address F0F0F0F0D2
//        rx = nrf.openPipe('rx', pipes[1], {size: 4}); // receive address F0F0F0F0D2
//    tx.on('ready', function () {
//        console.log('SendingUID:', uid.toString('hex'));
//        tx.write(uid);
//    });
//    rx.on('data', function (d) {
//        console.log("Got response back:", d);
//    });
//};

// hold this process open
process.ref();