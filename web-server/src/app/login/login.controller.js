(function () {
    'use strict';

    angular
        .module('BlurAdmin')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', '$rootScope', 'Auth', '$state'];
    function LoginController($scope, $rootScope, Auth, $state) {
        var vm = this;

        $scope.username = "";
        $scope.password = "";

        
        var thisUser = Auth.$getAuth();
        if(thisUser)
        {
            //console.log("Logged out");
            //$rootScope.auth.$signOut();
            $rootScope.loggedIn = true;
            console.log("Already logged in!");
            $state.go('/myPage');
        }
        //console.log($rootScope.auth);

        //console.log("Hello from LoginController");

        vm.login = login;

        $scope.tryLogin = function(){
             //$scope.firebaseUser = vm.username;
             //$scope.password = vm.password;
             $scope.error = null;

             //console.log($scope.username + " " + $scope.password);

             Auth.$signInWithEmailAndPassword($scope.username, $scope.password).then(function(user){
                $rootScope.loggedIn = true;
                $state.go('/myPage');
             }).catch(function(error){
                console.log(error.code);
                if(error.code == "auth/invalid-email")
                {
                    alert("Geçersiz E posta");
                }else if(error.code == "auth/wrong-password")
                {
                    alert("Kullanıcı Adı veya Şifre Yanlış");
                }
             });
        };

        $scope.message = "hello";

        function login() {
            vm.dataLoading = true;

        };
    }

})();