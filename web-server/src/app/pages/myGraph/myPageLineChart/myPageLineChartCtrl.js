(function () {
  'use strict';

  angular.module('BlurAdmin.pages.myPage')
      .controller('myPageLineChartCtrl', myPageLineChartCtrl);

  /** @ngInject */
  myPageLineChartCtrl.$inject = ['$scope'];

  var valCount = 50;

  function myPageLineChartCtrl($scope, $attrs) {
	var id = $scope.id;

    document.getElementById(id).style.width = $scope.width;
    document.getElementById(id).style.height = $scope.height;

    var chartData = $scope.chartdata;

    var chart = AmCharts.makeChart(id, {
        "type": "serial",
        "theme": "light",
        "marginRight": 80,
        "dataProvider": $scope.chartdata,
        "valueAxes": [{
            "position": "left",
            "title": "Unique visitors"
        }],
        "graphs": [{
            "id": "g1",
            "fillAlphas": 0.4,
            "valueField": "visits",
            "balloonText": "<div style='margin:5px; font-size:19px;'>Visits:<b>[[value]]</b></div>"
        }],
        "chartScrollbar": {
            "graph": "g1",
            "scrollbarHeight": 80,
            "backgroundAlpha": 0,
            "selectedBackgroundAlpha": 0.1,
            "selectedBackgroundColor": "#888888",
            "graphFillAlpha": 0,
            "graphLineAlpha": 0.5,
            "selectedGraphFillAlpha": 0,
            "selectedGraphLineAlpha": 1,
            "autoGridCount": true,
            "color": "#AAAAAA"
        },
        "chartCursor": {
            "categoryBalloonDateFormat": "JJ:NN, DD MMMM",
            "cursorPosition": "mouse"
        },
        "categoryField": "date",
        "categoryAxis": {
            "minPeriod": "mm",
            "parseDates": true
        }
    });

    chart.addListener("dataUpdated", zoomChart);
    // when we apply theme, the dataUpdated event is fired even before we add listener, so
    // we need to call zoomChart here
    zoomChart();
    // this method is called when chart is first inited as we listen for "dataUpdated" event
    function zoomChart() {
        // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
        chart.zoomToIndexes(chartData.length - 250, chartData.length - 100);
    }

    /*
    setInterval(function(){
        chart.dataProvider = $scope.chartdata;
        chart.validateData();
        console.log("here");
    }, 2000);*/
  }
})();