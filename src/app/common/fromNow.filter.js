(function() {

  'use strict';

  angular
    .module('ShowTrackr.common')
    .filter('fromNow', function() {
      return function(date) {
        return moment(date).fromNow();
      };
    });


})();
