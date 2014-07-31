(function() {

  'use strict';

  angular
    .module('ShowTrackr.login', [])
    .config(function($routeProvider) {
      $routeProvider
        .when('/login', {
          templateUrl: 'app/login/login.tpl.html',
          controller: 'LoginController',
          controllerAs: 'login'
        });
    });

})();
