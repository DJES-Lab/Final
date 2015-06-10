/**
 * Created by chen on 2015/6/10.
 */
//finite state machine
// state 0 = idle (waiting for RFID registering for using tessel-camera)
// state 1 = server (waiting for RFID and returning it to the account server)
var state = 0;

exports.getState = function() {
    return state;
};

exports.setState = function(s) {
    state = s;
};