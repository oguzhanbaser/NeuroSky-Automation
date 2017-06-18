var Gpio = require('pigpio').Gpio,
  motor = new Gpio(13, {mode: Gpio.OUTPUT}),
  pulseWidth = 1000;

module.exports.setValue = function(p_val)
{
    if(p_val <= 2000 && p_val >= 1000)
    {
        motor.servoWrite(p_val);
    }
}