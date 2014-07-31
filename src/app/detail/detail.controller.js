(function() {

  'use strict';

  angular
    .module('ShowTrackr.detail')
    .controller('DetailController', DetailController);

  function DetailController() {
    this.name = 'horse';
  }

})();
