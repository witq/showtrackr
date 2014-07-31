(function() {

  'use strict';

  angular
    .module('ShowTrackr.signup', [])
    .config(function($routeProvider) {
      $routeProvider
        .when('/signup', {
          templateUrl: 'app/signup/signup.tpl.html',
          controller: 'SignupController',
          controllerAs: 'signup'
        });
    });

})();
