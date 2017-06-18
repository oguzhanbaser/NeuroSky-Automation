var Mcp3008 = require('mcp3008.js'),
    adc = new Mcp3008();

var adcValues = [];
var counter = 0;

setInterval(function(){
    adc.read(counter, function (value) {
        value = value * 100 / 1023;
        adcValues[counter++] = parseInt(value);

        if(counter == 8) counter = 0;
    }); 
}, 1000);

module.exports.adcValues = adcValues;