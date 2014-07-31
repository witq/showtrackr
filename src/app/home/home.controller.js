(function() {

  'use strict';

  angular
    .module('ShowTrackr.home')
    .controller('HomeController', HomeController);

  function HomeController() {
    this.name = 'horse';
  }

})();
