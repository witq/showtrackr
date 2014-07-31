(function() {

  'use strict';

  angular
    .module('ShowTrackr.add')
    .controller('AddController', ['$alert', 'Show', AddController]);

  function AddController($alert, Show) {
    self = this;
    self.addShow = function() {
      Show.save({
        showName: self.showName
      },
      function() {
        self.showName = '';
        self.form.$setPristine();
        $alert({
          content: 'Tv show has been added.',
          placement: 'top-right',
          type: 'success',
          duration: 3
        });
      },
      function(response) {
        self.showName = '';
        self.form.$setPristine();
        $alert({
          content: response.data.message,
          placement: 'top-right',
          type: 'danger',
          duration: 3
        });
      });
    };
  }

})();
