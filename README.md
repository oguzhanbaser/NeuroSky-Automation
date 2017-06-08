# NeuroSky-Automation
### Basic room automation for paralytic people with NeuroSky Mindwave Sensor

In this project we used NeuroSky sensor to control electronic devices in a room. Fully paralytic people cannot use any limb. So they cannot 
control any devices without any help. But NeuroSky Brainwave sensor changes everything .. 

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

We used <b>Blur Admin</b> Dashboard to make web panel for all home users. This dhasboard work with AngularJS Framework and AngularJs compatible with Firebase. So it is very usefull for this application. because we use Firebase to communicate Raspberry Pi and Web panel.

##Project Structure

    - Blur Admin Dashboard
    - Raspberry Pi Node Js Server
        -- Pi server         (To control devices)
        -- Control Interface (for the patient)

...
