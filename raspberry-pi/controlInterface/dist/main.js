$(document).ready(function() {

    var socket = io.connect("http://"+ window.location.hostname + ":2500"); 

    socket.on('rawEEg', function(p_data){

    });

    function toggleAlert(){
        $(".alert").toggleClass('in out'); 
        return false; // Keep close.bs.alert event from removing from DOM
    }

    $("#bsalert").fadeOut(1);

    socket.on('signal', function(p_data){
        $("#quality").html("%" + String( (200 - p_data) / 2 ));
        if(p_data == 0)
        {
            $("#quality").animate({color: "#33cc33"}, 500);
        }else{
            $("#quality").animate({color: "#ff0000"}, 500);
        }
    });

    var pageAnchors  = ['secondPage', '3rdPage', '4thPage', '5thPage', '6thPage'];
    var locationCounter = 0;
    socket.on('blink', function(p_data){
        //console.log(p_data);
        locationCounter = p_data;
        window.location.href = "#" + pageAnchors[p_data];
    });

    socket.on('attention', function(p_data){
        var t_val = String(p_data) + "%";
        //console.log(t_val);
        $("#prb1").animate({width: t_val}, 200);
        $("#attSpan").text(String(p_data));

        
        if(p_data <= 30)
            $("#prb1").animate({'background-color': "#0099ff"}, 200);
        else if(p_data <= 50 && p_data > 30)
        {
            $("#prb1").animate({'background-color': "#33cc33"}, 200);
        }else if(p_data < 70 && p_data > 50){
            $("#prb1").animate({'background-color': "#ffcc00"}, 200);
        }else if(p_data > 70)
        {
            $("#prb1").animate({'background-color': "#A52A2A"}, 200);
        }
    });

    var chkArray = [
        $("#cooler"),
        $("#heater"),
        $("#light"),
        $("#curtain")
    ];

    socket.on('toggle', function(p_val){
        if(locationCounter == 4)
        {
            
            $("#section5").animate({"background-color": "#cc0000"}, 1500);
            $("#bsalert").fadeIn(1000);

            setTimeout(function(){
                $("#section5").animate({"background-color" : "#ffcc00"}, 1500);
                $("#bsalert").fadeOut(1000);
            }, 5000);

            return ;//aşağıya inmemesi lazım!!
        }

        if(!p_val)
        {
            chkArray[locationCounter].html("AÇIK");
            chkArray[locationCounter].animate({color: "#33cc33"}, 1000);
        }else{
            chkArray[locationCounter].html("KAPALI");
            chkArray[locationCounter].animate({color: "#ff3300"}, 1000);
        }
    });

    //circle.animate(1);
    $('#fullpage').fullpage({
        sectionsColor: ['#1bbc9b', '#4BBFC3', '#7BAABE', '#1bbc9b', '#cc9900', '#ff5050'],
        anchors: ['secondPage', '3rdPage', '4thPage', '5thPage', '6thPage'],
        menu: '#menu',
        loopTop: true,
        loopBottom: true
    });

    var gaugeOptions = {

        chart: {
            type: 'solidgauge'
        },

        title: null,

        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        tooltip: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        // the value axis
        yAxis: {
            stops: [
                [0.1, '#55BF3B'], // green
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#DF5353'] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickAmount: 2,
            title: {
                y: -70
            },
            labels: {
                y: 16
            }
        }
    };

    
    // The speed gauge
    var chartTemp = Highcharts.chart('speed1', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 60,
            title: {
                text: 'Sıcaklık'
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Speed',
            data: [50],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                    '<span style="font-size:12px;color:black">   C</span></div>'
            },
            tooltip: {
                valueSuffix: 'C'
            }
        }]
    }));

        // The speed gauge
    var chartHumi = Highcharts.chart('speed2', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 100,
            title: {
                text: 'Nem'
            }
        },
        credits: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Speed',
            data: [50],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                    '<span style="font-size:12px;color:black">   %</span></div>'
            },
            tooltip: {
                valueSuffix: ' %'
            }
        }]
    }));

        // The speed gauge
    var chartLight = Highcharts.chart('speed3', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 100,
            title: {
                text: 'Işık'
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Speed',
            data: [50],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                    '<span style="font-size:12px;color:black">   %</span></div>'
            },
            tooltip: {
                valueSuffix: ' %'
            }
        }]
    }));


    var pointTemp = chartTemp.series[0].points[0];
    var pointHumi = chartHumi.series[0].points[0];
    var pointLight = chartLight.series[0].points[0];
    
    socket.on('sensValues', function(p_data){
        //console.log(p_data);
        pointTemp.update(parseInt(p_data["currentTemp1"]));
        pointHumi.update(parseInt(p_data["currentHum1"]));
        pointLight.update(parseInt(p_data["currentLight1"]));
    });

    /*
    var chart = new SmoothieChart({millisPerPixel:6,grid:{fillStyle:'#ffffff'}}),
    canvas = document.getElementById('smoothie-chart');

    var random = new TimeSeries();
    setInterval(function() {
        random.append(new Date().getTime(), Math.random() * 10000);
    }, 20);
    
    chart.addTimeSeries(random, {lineWidth:2,strokeStyle:'#0080ff',fillStyle:'rgba(0,0,0,0.30)'});
    chart.streamTo(canvas, 2000);*/

    setTimeout(function(){
        $("#prb1").animate({'background-color': "#A52A2A"}, 1000);
    }, 1000);
});
