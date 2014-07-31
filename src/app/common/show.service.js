(function() {

  'use strict';

  angular
    .module('ShowTrackr.common')
    .factory('Show', ['$resource', Show]);

  function Show($resource) {
    return $resource('/api/shows/:id');
  }

})();
