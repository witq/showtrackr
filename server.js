(function(require) {

  'use strict';

  var bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      express = require('express'),
      logger = require('morgan'),
      path = require('path'),

      app = express();

  app
    .set('port', process.env.PORT || 3000)
    .use(logger('dev'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded())
    .use(cookieParser())
    .use(express.static(path.join(__dirname, 'public')));

  app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
  });

})(require);
