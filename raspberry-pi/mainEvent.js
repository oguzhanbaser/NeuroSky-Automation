var admin = require("firebase-admin");
var neuroSkyEvent = require("./serialEvent.js");

var dht11 = require("./dht11.js");
var mcpReader = require('./mcpRead.js');
const Raspi = require('raspi-io');
const five = require('johnny-five');
var servo = require('./servo.js');

var path = require('path');
var express = require('express');		//express framework unu çağırdık
var app = express();					
var http = require('http').Server(app);
var socket = require('socket.io')(http);
var port = 2500;

app.use(express.static(__dirname + '/controlInterface/'));

app.get('/', function(req ,res) {
	res.sendfile (__dirname + '/controlInterface/index.html');
});

http.listen(port,function(){
	console.log("Listeining: ", port);
});

var autoControl = false;

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

var relay1, relay2, relay3, relay4, relay5;
var relayArray = [];
var pinArray = [1, 2, 3, 0];
var pinValues = [false, false, false, false];

board.on('ready', () => {
  relay1 = new five.Led("P1-11");
  relay2 = new five.Led("P1-12");
  relay3 = new five.Led("P1-13");
  relay4 = new five.Led("P1-15");
  relay5 = new five.Led("P1-16");

  relay1.on();    //boş
  relay2.on();    //fan
  relay3.on();    //ısıtıcı
  relay4.on();    //ışık
  relay5.on();    //boş

  relayArray = [relay2, relay3, relay4, relay1, relay5];
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
var dbNurse = db.ref("/values/nurse");

var values = {},      //null
  raspiValues = {},   //şu an ki raspberry den gelen değerler
  setValues = {},     //ayarlanmış değerler
  relayValues = {};   //röle değerleri

var offsetVal = 1;
var intervalTime = 5000;
var lockTemp = false, lockLight = false;

dbRef.on('value', function(p_val) {
  setValues = p_val.val();
});

dbRelay.on('value', function(p_val) {
  relayValues = p_val.val();
  //console.log(relayValues);

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

    if(relayValues["curtain"])
    {
      openCurtain();
    }else{
      closeCurtain();
    }
  }else{
    lockTemp = false;
    lockLight = false;
  }

});

//rasgele değerler
raspiValues["currentHum1"] = 70;
raspiValues["currentTemp1"] = 70;
raspiValues["currentLight1"] = 70;

setInterval(function(){
  dbCurrent.set(raspiValues);
}, intervalTime);

var oldBlink, counter = 0, switchCount = 5;
var isChangedBlink = false, isChangedAttention = false;
var servoStat = false;
var newBlink = 0, attention = 0, quality = 200;

var neuroSky = new neuroSkyEvent();

setTimeout(function(){
  
  neuroSky.on("signal", function(p_val){
    quality = p_val;
  });

  neuroSky.on("attention", function(p_val){
    attention = p_val;
  });

  neuroSky.on("myBlink", function(p_val){
    if(quality == 0)
      newBlink = p_val;
  });

  neuroSky.on("rawEEG", function(p_val){

  });

}, 1500);

socket.on('connection', function(io){  
  console.log("Client Acildi");

  io.on("getFirstVals", function(p_val){
    var resArray = [];

    for(var i = 0 ; i < relayArray.length; i++)
    {
      resArray.push(relayArray[i].isOn);
    }
    socket.emit('resGetValues', resArray);
  });
});

//****************MAİN LOOP****************************/

setInterval(function(){
  
  raspiValues["currentHum1"] = dht11.values["humi"];
  raspiValues["currentTemp1"] = dht11.values["temp"];
  raspiValues["currentLight1"] = mcpReader.adcValues[0];

  socket.emit('sensValues', raspiValues);

  //console.log(quality);

  socket.emit('signal', quality);
  
  if(quality == 0)
  {
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
     if(counter < 5)
     {
      relayArray[counter].toggle();
      if(counter == 3)
      {
          if(servoStat)
          {
            servo.setValue(1100);
            servoStat = false;
          }else{
            servo.setValue(1900);
            servoStat = true;
          }
      }else if(counter == 4)
      {
        dbNurse.set(true);
      }
      console.log("switch toggled, relay ", counter);
      isChangedAttention = true;
      socket.emit('toggle', relayArray[counter].isOn);
      if(counter > 1) lockLight = true;             //hastanın otomaik kontolü kilitleme 
      if(counter < 2) lockTemp = true;              //istekleri
     }else{

     }
     setTimeout(function(){isChangedAttention = false}, 10000);
  }

  
  if(autoControl)
  {
    if((raspiValues["currentTemp1"] > setValues["temp1"] + offsetVal) && !lockTemp)
    {
      //console.log("fan çalıştı");
      runCooler();
      stopHeater();

    }else if((raspiValues["currentTemp1"] < setValues["temp1"] - offsetVal) && !lockTemp)
    {
      //console.log("Isııtıcı çalıştı");
      runHeater();
      stopCooler();
    }

    if((raspiValues["currentLight1"] > setValues["light1"]) && !lockLight)
    {
      //console.log("Işık Normal");
      closeCurtain();
    }else if((raspiValues["currentLight1"] < setValues["light1"]) && !lockLight)
    {
      //console.log("Işık Kapalı");
      openCurtain();
    }
  }
}, 1000);

function runCooler(){relay2.off();}
function stopCooler(){relay2.on();}
function runHeater(){relay3.off();}
function stopHeater(){relay3.on();}
function runLight(){relay4.off();}
function stopLight(){relay4.on();}
function openCurtain(){servo.setValue(1900);}
function closeCurtain(){servo.setValue(1100);}
