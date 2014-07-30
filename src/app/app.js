(function() {

  'use strict';

  angular
    .module('ShowTrackr', [
      'ngRoute',
      'ShowTrackr.common'
    ])
    .config(function($routeProvider) {

      $routeProvider
        .otherwise({
          redirectTo: '/home'
        });

    })
    .controller('AppController', function($scope) {

      // global app logic goes here (page title, navigation etc.)

    });

})();
