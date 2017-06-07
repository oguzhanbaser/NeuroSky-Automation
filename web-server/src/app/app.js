(function () {
'use strict';

  var blurAdmin = angular.module('BlurAdmin', [
    'ngAnimate',
    'ui.bootstrap',
    'ngMaterial',
    //'angular-material',
    'ui.sortable',
    'ui.router',
    //'ngTouch',
    'toastr',
    'smart-table',
    'xeditable',
    'ui.slimscroll',
    'ui.router',
    'ngJsTree',
    'firebase',
    'angular-progress-button-styles',
    'BlurAdmin.theme',
    'BlurAdmin.pages'
  ]);

  blurAdmin.config(function($stateProvider, $urlRouterProvider){
        $stateProvider
            .state('/auth', {
                url: '/auth',
                templateUrl: 'app/login/login.view.html',
                controller: 'LoginController',
                resolve: {
                    // controller will not be loaded until $requireSignIn resolves
                    // Auth refers to our $firebaseAuth wrapper in the factory below
                    "currentAuth": ["Auth", function(Auth) {
                      // $requireSignIn returns a promise so the resolve waits for it to complete
                      // If the promise is rejected, it will throw a $stateChangeError (see above)
                      return Auth.$waitForSignIn();
                    }]
                  }
                //controllerAs: 'vm' 
            });

  });

  //YOUR FIREBASE CONFIG HERE!!!!!!!!!!!!!!!!!!!!!!!!!!
  var config = {
    apiKey: "--",
    authDomain: "--",
    databaseURL: "--",
    storageBucket: "--",
  };

  firebase.initializeApp(config);

    blurAdmin.run(["$rootScope", "$state", function($rootScope, $state) {


      $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
        // We can catch the error thrown when the $requireSignIn promise is rejected
        // and redirect the user back to the home page
        $rootScope.loggedIn = false;

        console.log("status changed");
        if (error === "AUTH_REQUIRED") {
          $state.go("/auth");
        }
      });
    }]);

  
  blurAdmin.factory("Auth", ["$firebaseAuth",
      function($firebaseAuth) {
        return $firebaseAuth();
      }
    ]);


  blurAdmin.controller('indexController', ['$scope', '$rootScope', 'Auth', function($scope, $rootScope, Auth){
    //console.log(myRef);

    //console.log("Hello from indexController");
    $rootScope.user = "";
    $rootScope.pass = "";
    $rootScope.loggedIn = false;

    //console.log($rootScope.auth.$getAuth());


    /*
    $scope.$on("$destroy", function(){
      $rootScope.auth.$signOut();
    });*/

  }]);

})();