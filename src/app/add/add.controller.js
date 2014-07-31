(function() {

  'use strict';

  angular
    .module('ShowTrackr.add')
    .controller('AddController', AddController);

  function AddController() {
    this.name = 'horse';
  }

})();
