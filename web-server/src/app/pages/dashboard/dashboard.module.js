/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard', [])
      .config(routeConfig)
      .controller('dashboardCtrl', dashboardCtrl);

  /** @ngInject */
  function routeConfig($stateProvider) {
     
     $stateProvider.state('/dashboard', {
	      url: '/dashboard',
	      templateUrl: 'app/pages/dashboard/dashboard.html',
	      title: 'Dashboard',
	      sidebarMeta: {
	        icon: 'ion-android-home',
	        order: 0,
	      },
	      resolve: {
	        'currentAuth': ['Auth', function(Auth){
	            return Auth.$requireSignIn();
	        }]
	      },
	      controller: 'dashboardCtrl'
	});

  }

  dashboardCtrl.$inject = ['$scope', '$rootScope', 'Auth', '$firebaseObject'];
  function dashboardCtrl($scope, $rootScope, Auth, $firebaseObject)
  {
  	//console.log("Dashborad Ctrl: " + Auth.$getAuth());

  	var thisUser = Auth.$getAuth();


    if(thisUser)
    {
        $rootScope.loggedIn = true;

      	var uid = thisUser.uid;

	  	var ref = firebase.database().ref();
	  	
	  	$scope.user = $firebaseObject(ref.child('users').orderByChild(uid));
	  	//console.log($scope.user);
    }
  }


})();
