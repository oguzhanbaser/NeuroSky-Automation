(function () {
  'use strict';

  angular.module('BlurAdmin.pages.mySettings', [])
      .config(routeConfig)
      .controller('mySettingsCtrl', mySettingsCtrl);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('/mySettings', {
          url: '/mySettings',
          templateUrl: 'app/pages/mySettings/mySettings.html',
          title: 'Ayarlar',
          sidebarMeta: {
            icon: 'ion-android-laptop',
            order: 800
          },
          resolve: {
            'currentAuth': ['Auth', function(Auth){
                return Auth.$requireSignIn();
            }]
          },
          controller: 'mySettingsCtrl'
        });
  }

  mySettingsCtrl.$inject = ['$scope', '$rootScope', 'Auth', '$firebaseArray', 'toastr'];
  function mySettingsCtrl($scope, $rootScope, Auth, $firebaseArray, toastr)
  {
    
    $scope.thisName = "Oğuzhan Başer";
    $scope.sliderVal1 = 0;
    $scope.sliderVal2 = 0;
    $scope.counter = 0;

    var thisUser = Auth.$getAuth();
    //console.log("here");
    var uid = "";

    if(thisUser)
    {
        $rootScope.loggedIn = true;

        uid = thisUser.uid;

        var ref = firebase.database().ref();
        $scope.logValues = $firebaseArray(ref.child('/logs'));
        
    }

    $scope.clearLogs = function()
    {
        console.log("asd");
        var ref = firebase.database().ref();
        var db_vals = ref.child('logs/');
        db_vals.set(null);
    }
    

    $scope.sendAlert = function()
    {
        toastr.warning('Uyarı!', 'Bakıcıya Bildirim Yollandı!', {
          "timeOut": "5000",
        });
        var sendStr = String($scope.user.name) + " Bakıcıya Bildirim Gönderdi ";
        setLogValue(sendStr);
    }

    function setLogValue(p_val)
    {
      var ref = firebase.database().ref();
      var db_vals = ref.child('logs/');
      var db_values = $firebaseArray(ref.child('logs/'));

      var dt = new Date();
      var time = dt.getDate() + "-0" + dt.getMonth() + "-" + dt.getFullYear() + " "
            + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
      
      db_values.$loaded().then(function(pl_val){
        //console.log(pl_val.length);

        if(pl_val.length >= 5)
        {
          pl_val = pl_val.slice(1);
        }

      });

      db_vals.push(p_val + " " + String(time));
    }
  }



})();