(function(){

  'use strcit';

  var angularFilesort = require('gulp-angular-filesort'),
      bowerFiles      = require('main-bower-files'),
      cssmin          = require('gulp-minify-css'),
      changed         = require('gulp-changed'),
      es              = require('event-stream'),
      gulp            = require('gulp'),
      gulpif          = require('gulp-if'),
      inject          = require('gulp-inject'),
      less            = require('gulp-less'),
      livereload      = require('gulp-livereload'),
      ngAnnotate      = require('gulp-ng-annotate'),
      rimraf          = require('gulp-rimraf'),
      taskListing     = require('gulp-task-listing'),
      uglify          = require('gulp-uglify'),
      usemin          = require('gulp-usemin'),

      files,
      paths;

  paths = {
    src: './src',
    dest: './public',
  };

  // Main tasks

  gulp.task('help', taskListing);
  gulp.task('build', ['inject-app']);
  gulp.task('compile', ['compile-usemin']);

  // Watch

  gulp.task('watch', ['build'], function() {
    livereload.listen();
    gulp.watch(paths.src + '/styles/**/*.less', ['watch-less']);
    gulp.watch(paths.src + '/app/**/*.js', ['watch-app']);
  });

  gulp.task('watch-less', function() {
    return gulp
      .src(paths.src + '/styles/**/*.less', {base: paths.src})
      .pipe(less())
      .pipe(changed(paths.dest))
      .pipe(gulp.dest(paths.dest))
      .pipe(livereload());
  });

  gulp.task('watch-app', function() {
    return gulp
      .src([paths.src + '/**/*.js', '!' + paths.src + '/vendor/**/*'], {read: true})
      .pipe(changed(paths.dest))
      .pipe(gulp.dest(paths.dest))
      .pipe(livereload());
  });

  // Subtasks

  gulp.task('copy-all', ['clean-public'], function() {
    return gulp
      .src([paths.src + '/**/*.js', paths.src + '/**/*.html', '!' + paths.src + '/vendor/**/*'], {read: true})
      .pipe(gulp.dest(paths.dest));
  });

  gulp.task('copy-bower', ['copy-all'], function() {
    return gulp
      .src(bowerFiles(), {base: paths.src, read: true})
      .pipe(gulp.dest(paths.dest));
  });

  gulp.task('build-less', ['copy-bower'], function() {
    return gulp
      .src(paths.src + '/styles/**/*.less', {base: paths.src})
      .pipe(less())
      .pipe(gulp.dest(paths.dest));
  });

  gulp.task('inject-bower', ['build-less'], function() {
    return gulp
      .src(paths.dest + '/index.html')
      .pipe(inject(gulp.src(bowerFiles(), {base: paths.src, read: false}), {
        name: 'bower',
        endtag: '<!-- endbower -->',
        relative: false,
        transform: function(path) {
          var newPath = path.split('/').splice(2).join('/');
          return inject.transform.apply(inject.transform, [newPath]);
        }
      }))
      .pipe(gulp.dest(paths.dest));
  });

  gulp.task('inject-css', ['inject-bower'], function() {
    return gulp
      .src(paths.dest + '/index.html')
      .pipe(inject(gulp.src(paths.dest + '/styles/**/*.css', {read: true}), {
        name: 'app',
        endtag: '<!-- endapp -->',
        relative: true
      }))
      .pipe(gulp.dest(paths.dest));
  });

  gulp.task('inject-app', ['inject-css'], function() {
    return gulp
      .src(paths.dest + '/index.html')
      .pipe(inject(gulp.src(paths.dest + '/app/**/*.js').pipe(angularFilesort()), {
        name: 'app',
        endtag: '<!-- endapp -->',
        relative: true
      }))
      .pipe(gulp.dest(paths.dest));
  });

  gulp.task('clean-public', function() {
    return gulp
      .src('./public', {read: false})
      .pipe(rimraf({force: true}));
  });

  gulp.task('compile-usemin', ['inject-app'], function() {
    return gulp
      .src('./public/index.html')
      .pipe(usemin({
        js: [ngAnnotate(), uglify()],
        css: [cssmin()]
      }))
      .pipe(gulp.dest('./public'));
  });

})();
