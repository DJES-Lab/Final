/**
 * Created by chen on 2015/5/13.
 */
var fs = require('fs');
var code = JSON.parse(fs.readFileSync('json/rc-2020.json', 'utf8'));
module.exports = function parse(input) {

    var parseResult = 'unknown';
    var result = [], t;
    var diff = 5;
    for(var i = 0; i < input.length; i+=2){
        t = (input[i]*0x100+input[i+1]);//^65535;
        result[result.length] = (t > 32767 ? (-((t ^ 65535) + 1)) : t) / 50;
    }

    var keys = Object.keys(code);
    keys.forEach(function(key){
        for (var i = 0; i < 2; i++) {
            var sample = code[key][i];
            if(result.length != sample.length)
                continue;
            for (var j = 0; j < sample.length; j++) {
                if(Math.abs(result[j] - sample[j]) > diff){
                    break;
                }
            }
            if(j == result.length)
                parseResult = key;
        }
    });
    return parseResult;
};