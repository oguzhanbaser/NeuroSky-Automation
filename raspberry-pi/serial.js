var SerialPort = require("serialport");
var buffy = require("buffy");
var port = new SerialPort("/dev/rfcomm0", {
  baudRate: 57600,
  autoOpen: false,
  parser: SerialPort.parsers.raw,
});

var allData = {}, connected = false, rawEeg = 0;

CODE_EX = 0x55;              // Extended code
CODE_SIGNAL_QUALITY = 0x02;  // POOR_SIGNAL quality 0-255
CODE_ATTENTION = 0x04;       // ATTENTION eSense 0-100
CODE_MEDITATION = 0x05;      // MEDITATION eSense 0-100
CODE_BLINK = 0x16;           // BLINK strength 0-255
CODE_WAVE = 0x80;            // RAW wave value: 2-byte big-endian 2s-complement
CODE_ASIC_EEG = 0x83;        // ASIC EEG POWER 8 3-byte big-endian integers

port.open(function(){
  console.log("Connected!");
});

port.on('error', function(err) {
  console.log('Error: ', err.message);
});

port.on('data', function(data){
    var topReader = buffy.createReader(data);

    while(topReader.bytesAhead() > 2)
    {
      if(topReader.uint8() === 0xAA)
      {
        if(topReader.uint8() === 0xAA)
        {
            var pay_len = topReader.uint8();
            if(pay_len < 170)
            {
              //console.log("Len: " + pay_len);

              var checksum = 0;
              var payload = topReader.buffer(pay_len);
              for(var i = 0; i < pay_len; i++)
              {
                //payload[i] = topReader.uint8();
                checksum += payload[i];
              }

              checksum &= 0xFF;
              checksum = ~checksum & 0xFF;

              if(checksum == topReader.uint8())
              {
                //console.log(payload);
                var reader = buffy.createReader(payload);
                //console.log(reader.bytesAhead());

                while(reader.bytesAhead() > 0)
                {
                  //console.log(payload);
                  switch(reader.uint8())
                  {
                    case CODE_EX:
                      //console.log("extended");
                      break;

                    case CODE_SIGNAL_QUALITY:
                      var t_val = reader.uint8();
                      if(isDefined(t_val))
                      {
                        //console.log("signal " + t_val);
                        allData["signal"] = t_val;
                        connected = true;
                      }
                      break;

                    case CODE_ATTENTION:
                      var t_val = reader.uint8();
                      if(isDefined(t_val))
                      {
                        //console.log("attention " + t_val);
                        allData["attention"] = t_val;
                      }
                      break;

                    case CODE_MEDITATION:
                      var t_val = reader.uint8();
                      if(isDefined(t_val))
                      {
                        //console.log("meditation " + t_val);
                        allData["meditation"] = t_val;
                      }
                      break;

                    case CODE_BLINK:
                      var t_val = reader.uint8();
                      if(isDefined(t_val))
                      {
                        //console.log("blink " + t_val);
                        allData["blink"] = t_val;
                      }
                      break;

                    case CODE_WAVE:
                      reader.skip(1);
                      allData["wave"] = reader.int16BE();
                      rawEeg = allData["wave"];
                      if(allData["signal"] == 0)
                      {
                        if(rawEeg > maxValue)
                        {
                          maxValue = rawEeg;
                        }
                        
                        if((allData["wave"] > 500 || allData["wave"] < -500) && !waveStat)
                        {
                          waveStat = true;
                        }else if((allData["wave"] < 10 && allData["wave"] > -10) && waveStat){
                          zeroCounter++;
                        }

                        if(waveStat)
                        {
                          averageWave += allData["wave"];
                          waveCounter++;
                        }

                        if(zeroCounter == 2)
                        {
                          zeroCounter = 0;
                          waveStat = false;
                          if(maxValue > 1200)
                          {
                            allData["myBlink"] = waveCounter;
                          }else{
                            allData["myBlink"] = 0;
                          }
                          waveVal = averageWave / waveCounter;
                          this.emit("myBlink", waveCounter);
                          //console.log(waveCounter);
                          waveCounter = 0;
                        }
                      }
                      break;
                    case CODE_ASIC_EEG:
                      reader.buffer(24);
                      //console.log("eeg "+ reader.buffer(24));
                      break;
                  }
                }
              }
            }

            if(allData["signal"] == 0)
            {
              //console.log(allData);
              if(allData["wave"] > 500 || allData["wave"] < -500)
              {
                //console.log("Serial: " + allData);
              }
            }else{
              //console.log("Signal:" + allData["signal"]);
            }
            
        }
      }
    }
});

var waveStat = false;
var zeroCounter = 0, waveVal = 0, waveCounter = 0, averageWave = 0;;
var maxValue = 0;

function isDefined(p_val)
{
  if(p_val != undefined) return true;
  else return false;
}

module.exports.allData = allData;
module.exports.connected = connected;
module.exports.rawEeg = rawEeg;
//module.exports = localEmitter;
