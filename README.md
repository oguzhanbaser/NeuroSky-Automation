# NeuroSky-Automation
### Basic room automation for paralytic people with NeuroSky Mindwave Sensor

In this project we used NeuroSky sensor to control electronic devices in a room. Fully paralytic people cannot use any limb. So they cannot 
control any devices without help. But NeuroSky Brainwave sensor changes everything .. 

There are lots of system in this project. So requirements list is long a bit.

If you want to do this project you will need this devices:

    - Raspberry Pi 3
    - DHT11 Humdity and Temperature Sensor
    - Servo Motor
    - LDR
    - 8 Channel Relay (Min 4 channel)
    - 3A 5V Regulator
    - MCP3008

And you will need this softwares:
    -Node JS
    -Wiring Pi (To control Raspbery Pi pins)
    -Gort (to connect with bluetooth)

We used <b>Blur Admin</b> Dashboard to make web panel for all home users. This dashboard work with AngularJS Framework. AngularJs is a very good framework to using Firebase. So it is very usefull for this application. Because we use Firebase to communicate Raspberry Pi and Web panel.

## Project Structure

    - Blur Admin Dashboard
    - Raspberry Pi Node Js Server
        -- Pi server         (To control devices)
        -- Control Interface (for the patient)


## Connection diagram
<img src="raspberry-pi\fritzing\bitirme_bb.png"></img>

## Starting Steps

In raspberry pi:

You should change mac adress in "connectBluetooth.sh". After that you can connect with this command. You can download gort from <a href="http://gort.io/documentation/getting_started/downloads/" target="_blank">this link</a>.

```sh

sudo ./connectBluetooth.sh

```

When bluetooth connect, port will open at /dev/rfcomm0. So you should listen this port in "serial.js" & "serialEvent.js". After connect you should open new terminal after connect bluetooth. 

```sh

npm install
sudo node mainEvent.js

```

### Attention

main.js and mainEvent.js are same thing. Only difference between these mainEvent.js works with events. You have to run one of these files. 


...
