var Mcp3008 = require('mcp3008.js'),
    adc = new Mcp3008();

var adcValues = [];
var counter = 0;

setInterval(function(){
    adc.read(counter, function (value) {
        adcValues[counter++] =value;

        if(counter == 8) counter = 0;
    }); 
}, 1000);

module.exports.adcValues = adcValues;