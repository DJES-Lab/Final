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
    .use(tessel.port['D']);

nrf._debug = false;

nrf.on('ready', function () {
    setTimeout(function(){
        nrf.printDetails();
    }, 5000);

    console.log("PONG back");
    var rx = nrf.openPipe('rx', pipes[0], {size: 4});
    tx = nrf.openPipe('tx', pipes[1], {autoAck: false});
    rx.on('data', function (d) {
        console.log("Got data, will respond", d);
        tx.write(d);
    });
    tx.on('error', function (e) {
        console.warn("Error sending reply.", e);
    });
});

// hold this process open
process.ref();