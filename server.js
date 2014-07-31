(function(require) {

  'use strict';

  var async         = require('async'),
      bcrypt        = require('bcryptjs'),
      bodyParser    = require('body-parser'),
      cookieParser  = require('cookie-parser'),
      express       = require('express'),
      logger        = require('morgan'),
      mongoose      = require('mongoose'),
      path          = require('path'),
      request       = require('request'),
      xml2js        = require('xml2js'),
      _             = require('lodash'),

      app, showSchema, Show, userSchema, User;

  app = express();

  showSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    airsDayOfWeek: String,
    airsTime: String,
    firstAired: Date,
    genre: [String],
    network: String,
    overview: String,
    rating: Number,
    ratingCount: Number,
    status: String,
    poster: String,
    subscribers: [{
      type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    episodes: [{
      season: Number,
      episodeNumber: Number,
      episodeName: String,
      firstAired: Date,
      overview: String
    }]
  });

  userSchema = new mongoose.Schema({
    email: {
      type: String,
      unique: true
    },
    password: String
  });

  userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) {
      return next();
    }
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  });

  User = mongoose.model('User', userSchema);
  Show = mongoose.model('Show', showSchema);

  mongoose.connect('localhost');

  app
    .set('port', process.env.PORT || 3000)
    .use(logger('dev'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded())
    .use(cookieParser())
    .use(express.static(path.join(__dirname, 'public')));

  app.get('/api/shows', function(req, res, next) {
    var query = Show.find();
    if (req.query.genre) {
      query.where({ genre: req.query.genre });
    } else if (req.query.alphabet) {
      query.where({ name: new RegExp('^' + '[' + req.query.alphabet + ']', 'i') });
    } else {
      query.limit(12);
    }
    query.exec(function(err, shows) {
      if (err) {
        return next(err);
      }
      res.send(shows);
    });
  });

  app.get('/api/shows/:id', function(req, res, next) {
    Show.findById(req.params.id, function(err, show) {
      if (err) return next(err);
      res.send(show);
    });
  });

  app.post('/api/shows', function(req, res, next) {
    var apiKey = '9EF1D1E7D28FDA0B';
    var parser = xml2js.Parser({
      explicitArray: false,
      normalizeTags: true
    });
    var seriesName = req.body.showName
      .toLowerCase()
      .replace(/ /g, '_')
      .replace(/[^\w-]+/g, '');

    async.waterfall([
      function(callback) {
        request.get('http://thetvdb.com/api/GetSeries.php?seriesname=' + seriesName, function(error, response, body) {
          if (error) return next(error);
          parser.parseString(body, function(err, result) {
            if (!result.data.series) {
              return res.send(404, { message: req.body.showName + ' was not found.' });
            }
            var seriesId = result.data.series.seriesid || result.data.series[0].seriesid;
            callback(err, seriesId);
          });
        });
      },
      function(seriesId, callback) {
        request.get('http://thetvdb.com/api/' + apiKey + '/series/' + seriesId + '/all/en.xml', function(error, response, body) {
          if (error) return next(error);
          parser.parseString(body, function(err, result) {
            var series = result.data.series;
            var episodes = result.data.episode;
            var show = new Show({
              _id: series.id,
              name: series.seriesname,
              airsDayOfWeek: series.airs_dayofweek,
              airsTime: series.airs_time,
              firstAired: series.firstaired,
              genre: series.genre.split('|').filter(Boolean),
              network: series.network,
              overview: series.overview,
              rating: series.rating,
              ratingCount: series.ratingcount,
              runtime: series.runtime,
              status: series.status,
              poster: series.poster,
              episodes: []
            });
            _.each(episodes, function(episode) {
              show.episodes.push({
                season: episode.seasonnumber,
                episodeNumber: episode.episodenumber,
                episodeName: episode.episodename,
                firstAired: episode.firstaired,
                overview: episode.overview
              });
            });
            callback(err, show);
          });
        });
      },
      function(show, callback) {
        var url = 'http://thetvdb.com/banners/' + show.poster;
        request({ url: url, encoding: null }, function(error, response, body) {
          show.poster = 'data:' + response.headers['content-type'] + ';base64,' + body.toString('base64');
          callback(error, show);
        });
      }
    ], function(err, show) {
      if (err) return next(err);
      show.save(function(err) {
        if (err) {
          if (err.code == 11000) {
            return res.send(409, { message: show.name + ' already exists.' });
          }
          return next(err);
        }
        res.send(200);
      });
    });
  });

  app.get('*', function(req, res) {
    res.redirect('/#' + req.originalUrl);
  });

  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.send(500, { message: err.message });
  });

  app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
  });


})(require);
