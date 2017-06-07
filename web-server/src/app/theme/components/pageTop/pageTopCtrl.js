(function () {
    'use strict';

    angular
        .module('BlurAdmin')
        .controller('pageTopCtrl', pageTopCtrl);

    pageTopCtrl.$inject = ['$scope', 'Auth', '$rootScope', '$state', '$firebaseObject'];
    function pageTopCtrl($scope, Auth, $rootScope, $state, $firebaseObject) {
        //console.log("hello from pageTopCtrl");


        var thisUser = Auth.$getAuth();
        if(thisUser)
        {
            var uid = thisUser.uid;

            var ref = firebase.database().ref();
            $scope.user = $firebaseObject(ref.child('users/' + uid));

            //console.log($scope.user);
        }
        
        $scope.signOut = function(){
            if(Auth.$getAuth())
            {
                Auth.$signOut().then(function(){ 
                    console.log("sign out");               
                    $rootScope.loggedIn = false;
                    $state.go('/auth');
                });
            }
        }
    }

})();