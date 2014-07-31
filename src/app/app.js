(function() {

  'use strict';

  angular
    .module('ShowTrackr', [
      'ngCookies',
      'ngResource',
      'ngRoute',
      'mgcrea.ngStrap',
      'ShowTrackr.common',
      'ShowTrackr.home',
      'ShowTrackr.detail',
      'ShowTrackr.add',
      'ShowTrackr.login',
      'ShowTrackr.signup'
    ])
    .config(function($locationProvider, $routeProvider) {

      $locationProvider
        .html5Mode(false);

      $routeProvider
        .otherwise({
          redirectTo: '/home'
        });

    })
    .controller('AppController', AppController);

  function AppController() {
    console.log('app loaded');
  }

})();
