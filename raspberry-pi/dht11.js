var sensor = require('node-dht-sensor');

var values = {};

setInterval(function(){
    sensor.read(11, 26, function(err, temperature, humidity) {
        if (!err) {
            /*
            console.log('temp: ' + temperature.toFixed(1) + 'C, ' +
                'humidity: ' + humidity.toFixed(1) + '%'
            );*/
            values["temp"] = temperature.toFixed(1);
            values["humi"] = humidity.toFixed(1);
        }
    });

}, 1000);

module.exports.values = values;