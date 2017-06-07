(function () {
  'use strict';

  angular.module('BlurAdmin.pages.myPage', ['angularjs-gauge'])
      .config(routeConfig)
      .controller('myPageCtrl', myPageCtrl);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('/myPage', {
          url: '/myPage',
          templateUrl: 'app/pages/myPage/myPage.html',
          title: 'Ana Sayfa',
          sidebarMeta: {
            icon: 'ion-android-home',
            order: 800
          },
          resolve: {
            'currentAuth': ['Auth', function(Auth){
                return Auth.$requireSignIn();
            }]
          },
          controller: 'myPageCtrl'
        });
  }

  myPageCtrl.$inject = ['$scope', '$rootScope', 'Auth', '$firebaseObject', '$firebaseArray', 'toastr'];
  function myPageCtrl($scope, $rootScope, Auth, $firebaseObject, $firebaseArray, toastr)
  {
    
    $scope.sliderVal1 = 0;
    $scope.sliderVal2 = 0;
    $scope.counter = 0;

    var thisUser = Auth.$getAuth();
    //console.log(thisUser);
    var uid = "";

    if(thisUser)
    {
        $rootScope.loggedIn = true;

        uid = thisUser.uid;

        var ref = firebase.database().ref();
        $scope.relayValues = $firebaseObject(ref.child('values/relayValues'));
        $scope.currentValues = $firebaseObject(ref.child('values/currentValues'));
        $scope.oldValues = $firebaseObject(ref.child('values/oldValues'));
        
        $scope.user = $firebaseObject(ref.child('users/' + uid));

        $scope.nurse = ref.child('values/nurse');
    }

    $scope.nurse.on("value", function(p_data){
      //console.log(p_data.val());
      if(p_data.val() == true)
      {
          toastr.warning('Uyarı!', 'Hasta, bakıcıyı çağırdı!', {
            "timeOut": "5000",
          });
          setTimeout(function(){
            $scope.nurse.set(false);
          }, 1000);
      }
    });

    $scope.swipe1Changed =  function(p_val)
    {
      setValue("relayValues/auto", p_val);
      var sendStr = String($scope.user.name) + " Oto kontrolü " + (p_val == 1 ? "Açtı " : "Kapattı ");
      setLogValue(sendStr);
    }

    $scope.swipe2Changed =  function(p_val)
    {
      setValue("relayValues/cooler", p_val);
      var sendStr = String($scope.user.name) + " Soğutucuyu " + (p_val == 1 ? "Açtı " : "Kapattı ");
      setLogValue(sendStr);
    }

    $scope.swipe3Changed =  function(p_val)
    {
      setValue("relayValues/heater", p_val);
      var sendStr = String($scope.user.name) + " Isıtıcıyı " + (p_val == 1 ? "Açtı " : "Kapattı ");
      setLogValue(sendStr);
    }

    $scope.swipe4Changed = function(p_val)
    {
      setValue("relayValues/light", p_val);
      var sendStr = String($scope.user.name) + " Işıkları " + (p_val == 1 ? "Açtı " : "Kapattı ");
      setLogValue(sendStr);
    }

    $scope.swipe5Changed = function(p_val)
    {
      setValue("relayValues/curtain", p_val);
      var sendStr = String($scope.user.name) + " Perdeyi " + (p_val == 1 ? "Açtı " : "Kapattı ");
      setLogValue(sendStr);
    }

    $scope.slider1Changed = function(p_val)
    {
      setValue("oldValues/temp1", p_val);
      var sendStr = String($scope.user.name) + " Sıcaklığı " + String(p_val) + " ayarladı ";
      setLogValue(sendStr);
    }

    $scope.slider2Changed = function(p_val)
    {
      setValue("oldValues/light1", p_val);
      var sendStr = String($scope.user.name) + " Işığı " + String(p_val) + " ayarladı ";
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

  function setValue(p_title, p_val) {
    // A post entry.

    var ref = firebase.database().ref();
    var db_values = ref.child('values/' + p_title);
    return db_values.set(p_val);
  }

  function readValue(p_title, p_child)
  {
    var ref = firebase.database().ref();
    var db_values = ref.child('values/' + p_child);
    var r_val;

    db_values.on('value', function(p_val){
      r_val = p_val.val()[p_title];
    });

    return r_val;
  }

})();