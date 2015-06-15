/**
 * Created by chen on 2015/6/10.
 */
//finite state machine
// state 0 = locked
// state 1 = unlocked
var state = 0;

exports.getState = function() {
    return state;
};

exports.setState = function(s) {
    state = s;
};