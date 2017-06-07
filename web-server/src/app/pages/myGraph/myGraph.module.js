(function () {
  'use strict';

  angular.module('BlurAdmin.pages.myGraph', [])
      .config(routeConfig)
      .controller('myGraphCtrl', myGraphCtrl);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('/myGraph', {
          url: '/myGraph',
          templateUrl: 'app/pages/myGraph/myGraph.html',
          title: 'Grafikler',
          sidebarMeta: {
            icon: 'ion-stats-bars',
            order: 800
          },
          resolve: {
            'currentAuth': ['Auth', function(Auth){
                return Auth.$requireSignIn();
            }]
          },
          controller: 'myGraphCtrl'
        });
  }

  myGraphCtrl.$inject = ['$scope', '$rootScope', 'Auth', '$firebaseObject', '$firebaseArray'];
  function myGraphCtrl($scope, $rootScope, Auth, $firebaseObject, $firebaseArray)
  {
    //console.log("Dashborad Ctrl: " + Auth.$getAuth());
    var thisUser = Auth.$getAuth();
    //console.log("here");
    var uid = "";

    if(thisUser)
    {
        $rootScope.loggedIn = true;

        uid = thisUser.uid;

        var ref = firebase.database().ref();
        $scope.values = $firebaseObject(ref.child('values'));
        $scope.currentValues = $firebaseObject(ref.child('values/currentValues'));
        $scope.oldValues = $firebaseObject(ref.child('values/oldValues'));
        $scope.valuesArrayT = $firebaseObject(ref.child('valuesArray/tempArray'));
        $scope.user = $firebaseObject(ref.child('users/' + uid));

    }

    $scope.thisName = $scope.user["name"] + " " +$scope.user["surname"];
    var lineChart;

    var counter = 0;
    $scope.graph = {};
    var i = 10;

    $scope.update = function() {

    }

    setInterval($scope.update, 500);

    $scope.$on('chart-create', function (evt, chart) {
      console.log(chart);
      lineChart = chart;
    });

    /*
    var chartData1 = [], i = 0, sampleCount = 25;
    var cc = setInterval(function()
    {
          var dt = new Date();
          var time = dt.getDate() + "-0" + dt.getMonth() + "-" + dt.getFullYear() + " "
            + dt.getHours() + "-" + dt.getMinutes() + "-" + dt.getSeconds();

          var a1 = Math.round(Math.random() * (40 + i)) + 100 + i;

          chartData1.push({
              value: a1,
              year: time
          });

          if(i > sampleCount)
          {
            clearInterval(cc);
            //setValue("tempArray", chartData1);
            //console.log(chartData1);
          }
          
    }, 1000);*/
    
    $scope.myVal = generateChartData();
    //console.log($scope.myVal);
  
    function setValue(p_title, p_val) {
      // A post entry.

      var ref = firebase.database().ref();
      var db_values = ref.child('valuesArray/' + p_title);
      return db_values.set(p_val);
    }

    $scope.tValue = [{
	                "year": "01-10-2014 10-11-12",
	                "value": -0.307
	            }, {
	                "year": "01-10-2014 10-11-13",
	                "value": -0.168
	            }, {
	                "year": "01-10-2014 10-11-14",
	                "value": -0.073
	            }, {
	                "year": "01-10-2014 10-11-15",
	                "value": -0.027
	            }, {
	                "year": "01-10-2014 10-11-16",
	                "value": -0.251
	            }, {
	                "year": "01-10-2014 10-11-17",
	                "value": -0.281
	            }, {
	                "year": "01-10-2014 10-11-18",
	                "value": -0.348
	            }, {
	                "year": "01-10-2014 10-11-19",
	                "value": -0.074
	            }, {
	                "year": "01-10-2014 10-11-20",
	                "value": -0.011
	            }, {
	                "year": "01-10-2014 10-11-21",
	                "value": -0.074
	            }, {
	                "year": "01-10-2014 10-11-22",
	                "value": -0.124
	            }];


     // generate some random data, quite different range
     function generateChartData() {
        var chartData = [];
        // current date
        var firstDate = new Date();
        // now set 500 minutes back
        firstDate.setMinutes(firstDate.getDate() - 1000);

        // and generate 500 data items
        for (var i = 0; i < 20; i++) {
            var newDate = new Date(firstDate);
            // each time we add one minute
            newDate.setMinutes(newDate.getMinutes() + i);
            // some random number
            var visits = Math.round(Math.random() * 40 + 10 + i + Math.random() * i / 5);
            // add data item to the array

            chartData.push({
                date: newDate.toString(),
                visits: visits
            });
        }
        return chartData;
    }
              
  }

})();