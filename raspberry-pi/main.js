var admin = require("firebase-admin");
var neuroSky = require("./serial.js");
var dht11 = require("./dht11.js");
var mcpReader = require('./mcpRead.js');
const Raspi = require('raspi-io');
const five = require('johnny-five');

var path = require('path');
var express = require('express');	
var app = express();					
var http = require('http').Server(app);
var socket = require('socket.io')(http);
var port = 2500;

app.use(express.static(path.join(__dirname + '/controlInterface')));

app.get('/', function(req ,res) {
	res.sendFile (__dirname + '/controlInterface/index.html');
});

const board = new five.Board({
  io: new Raspi({
    excludePins: [
      'MOSI0',
      'MISO0',
      'SCLK0',
      'CE0',
      'MOSI1',
      'MISO1',
      'SCLK1',
      'CE1',
    ]
  })
});

var relay1, relay2, relay3, relay4;
var relayArray = [];

board.on('ready', () => {
  relay1 = new five.Led("P1-11");
  relay2 = new five.Led("P1-12");
  relay3 = new five.Led("P1-13");
  relay4 = new five.Led("P1-15");

  relay1.on();    //boş
  relay2.on();    //fan
  relay3.on();    //ısıtıcı
  relay4.on();    //ışık

  relayArray = [relay1, relay2, relay3, relay4];
});

var serviceAccount = require("./homeautomation2.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://homeautomation2-e8bd0.firebaseio.com"
});

var db = admin.database();
var dbRef = db.ref("/values/oldValues");          //ayarlı değerler
var dbCurrent = db.ref("/values/currentValues");  //real time değerler
var dbRelay = db.ref("/values/relayValues");

var values = {},      //null
  raspiValues = {},   //şu an ki raspberry den gelen değerler
  setValues = {},     //ayarlanmış değerler
  relayValues = {};   //röle değerleri

var offsetVal = 1;
var autoControl = true;
var intervalTime = 5000;

dbRef.on('value', function(p_val) {
  setValues = p_val.val();
});

dbRelay.on('value', function(p_val) {
  relayValues = p_val.val();

  autoControl = relayValues["auto"];

  if(!autoControl)
  {
    if(relayValues["cooler"])
    {
      runCooler();
    }else{
      stopCooler();
    }

    if(relayValues["heater"])
    {
      runHeater();
    }else{
      stopHeater();
    }

    if(relayValues["light"])
    {
      runLight();
    }else{
      stopLight();
    }
  }

});

//rasgele değerler
raspiValues["currentHum1"] = 70;
raspiValues["currentTemp1"] = 70;
raspiValues["currentLight1"] = 70;

setInterval(function(){
  dbCurrent.set(raspiValues);
}, intervalTime);

var oldBlink, counter = 0, switchCount = 4;
var isChangedBlink = false, isChangedAttention = false;

//****************MAİN LOOP****************************/
setInterval(function(){
  
  console.log(mcpReader.adcValues);

  raspiValues["currentHum1"] = dht11.values["humi"];
  raspiValues["currentTemp1"] = dht11.values["temp"];

  
  var newBlink = 0, attention = 0, quality = 200;

  console.log(neuroSky.allData);

  var quality = neuroSky.allData["signal"];

  if(quality == 0)
  {
    newBlink = neuroSky.allData["myBlink"];
    attention = neuroSky.allData["attention"];

    socket.emit('attention', attention);
  }

  if((newBlink != oldBlink) && (newBlink >= 150) && !isChangedBlink)
  {
     counter++;
     if(counter == switchCount) counter = 0;
     oldBlink = newBlink;
     console.log("blink detected ", counter);
     isChangedBlink = true;
     socket.emit('blink', counter);
     setTimeout(function(){isChangedBlink = false}, 3000);
  }

  if((attention > 70) && !isChangedAttention)
  {
     isChanged = true;
     //relayArray[counter].toggle();
     console.log("switch toggled, relay ", counter);
     isChangedAttention = true;
     socket.emit('toggle', 1);
     setTimeout(function(){isChangedAttention = false}, 10000);
  }
  
  if(autoControl)
  {
    if(raspiValues["currentTemp1"] > setValues["temp1"] + offsetVal)
    {
      console.log("fan çalıştı");
      runCooler();
      stopHeater();

    }else if(raspiValues["currentTemp1"] < setValues["temp1"] - offsetVal)
    {
      console.log("Isııtıcı çalıştı");
      runHeater();
      stopCooler();
    }

    if(raspiValues["currentLight1"] > setValues["light1"])
    {
      console.log("Işık Normal");
    }else if(raspiValues["currentLight1"] < setValues["light1"])
    {
      console.log("Işık Yandı")
    }
  }
}, 1000);

http.listen(port,function(){
	console.log("Listeining: ", port);
});

function runCooler(){relay2.off();}
function stopCooler(){relay2.on();}
function runHeater(){relay3.off();}
function stopHeater(){relay3.on();}
function runLight(){relay4.off();}
function stopLight(){relay4.on();}