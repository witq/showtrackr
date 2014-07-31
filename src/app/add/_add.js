(function() {

  'use strict';

  angular
    .module('ShowTrackr.add', [])
    .config(function($routeProvider) {
      $routeProvider
        .when('/add', {
          templateUrl: 'app/add/add.tpl.html',
          controller: 'AddController',
          controllerAs: 'add'
        });
    });

})();
