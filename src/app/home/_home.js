(function() {

  'use strict';

  angular
    .module('ShowTrackr.home', [])
    .config(function($routeProvider) {
      $routeProvider
        .when('/home', {
          templateUrl: 'app/home/home.tpl.html',
          controller: 'HomeController',
          controllerAs: 'home'
        });
    });

})();
