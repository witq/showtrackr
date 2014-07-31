(function() {

  'use strict';

  angular
    .module('ShowTrackr.detail', [])
    .config(function($routeProvider) {
      $routeProvider
        .when('/shows/:id', {
          templateUrl: 'app/detail/detail.tpl.html',
          controller: 'DetailController',
          controllerAs: 'view'
        });
    });

})();
