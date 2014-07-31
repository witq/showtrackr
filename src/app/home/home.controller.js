(function() {

  'use strict';

  angular
    .module('ShowTrackr.home')
    .controller('HomeController', ['Show', HomeController]);

  function HomeController(Show) {

    this.alphabet = ['0-9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
      'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
      'Y', 'Z'];

    this.genres = ['Action', 'Adventure', 'Animation', 'Children', 'Comedy',
      'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'Food',
      'Home and Garden', 'Horror', 'Mini-Series', 'Mystery', 'News', 'Reality',
      'Romance', 'Sci-Fi', 'Sport', 'Suspense', 'Talk Show', 'Thriller',
      'Travel'];

    this.headingTitle = 'Top 12 Shows';

    this.shows = Show.query();

    this.filter = function(type, param) {
      this.shows = Show.query({type: param});
      this.heading = param;
    };

  }

})();
