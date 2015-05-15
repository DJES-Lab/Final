/**
 * Created by derek on 2015/5/11.
 */
var tessel = require('tessel');
var servolib = require('servo-pca9685');
var servo = servolib.use(tessel.port['C']);

var servo1 = 1; // We have a servo plugged in at position 1
var position = 0; // Target position of the servo between 0 (min) and 1 (max).

servo.on('ready', function () {
    //  Set the minimum and maximum duty cycle for servo 1.
    //  If the servo doesn't move to its full extent or stalls out
    //  and gets hot, try tuning these values (0.05 and 0.12).
    //  Moving them towards each other = less movement range
    //  Moving them apart = more range, more likely to stall and burn out
    servo.configure(servo1, 0.05, 0.12, function () {
        servo.move(servo1, position);
        console.log('Servo is ready!');
    });
});

exports.servoLeft = function() {
    position -= 0.1;
    if (position < 0) {
        position = 0;
    }
    servo.move(servo1, position);
};

exports.servoRight = function() {
    position += 0.1;
    if (position > 1) {
        position = 1;
    }
    servo.move(servo1, position);
};

exports.autoPanorama = function() {
    position = 0;
    for (var i = 0; i < 10; i++) {
        setInterval(function () {
            //  Set servo #1 to position pos.
            servo.move(servo1, position);
            /////////////////////////////////// require camera to take a picture

            // Increment by 10% (~18 deg for a normal servo)
            position += 0.1;
        }, 1000 * i); // Every 1 sec
    }
};
