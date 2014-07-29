(function() {

  'use strict';

  angular
    .module('myApp', [
      'ngRoute',
      'myApp.common',
      'myApp.home'
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
