(function(){

  'use strcit';

  var angularFilesort = require('gulp-angular-filesort'),
      bowerFiles      = require('main-bower-files'),
      cssmin          = require('gulp-minify-css'),
      es              = require('event-stream'),
      gulp            = require('gulp'),
      gulpif          = require('gulp-if'),
      inject          = require('gulp-inject'),
      less            = require('gulp-less'),
      ngAnnotate      = require('gulp-ng-annotate'),
      rimraf          = require('gulp-rimraf'),
      taskListing     = require('gulp-task-listing'),
      uglify          = require('gulp-uglify'),
      usemin          = require('gulp-usemin');

  // Main tasks

  gulp.task('help', taskListing);
  gulp.task('compile', ['compile-usemin']);
  gulp.task('build', ['inject', 'copy-all', 'less-build']);
  gulp.task('clean', ['clean-public']);
  gulp.task('copy', ['copy-app-all', 'copy-bower']);
  gulp.task('inject', ['inject-bower', 'inject-js', 'inject-css']);

  // Subtasks

  gulp.task('less-build', function() {
    return gulp
      .src('./src/styles/**/*.less', {base: './src'})
      .pipe(less())
      .pipe(gulp.dest('./public'));
  });

  gulp.task('copy-app', function() {
    return gulp
      .src(['./src/**/*.js'], {base: './src', read: true})
      .pipe(gulp.dest('./public'));
  });

  gulp.task('copy-all', function() {
    var app = gulp.src(['./src/**/*.js', './src/**/*.html'], {base: './src', read: true}),
        vendor = gulp.src(bowerFiles(), {base: './', read: true});
    return es.merge(app, vendor)
      .pipe(gulp.dest('./public'));
  });

  gulp.task('inject-bower', ['inject-css'], function() {
    return gulp
      .src('./src/index.html')
      .pipe(inject(gulp.src(bowerFiles(), {base: './', read: true}), {
        name: 'bower',
        endtag: '<!-- endbower -->',
        relative: true
      }))
      .pipe(gulp.dest('./src'));
  });

  gulp.task('inject-js', function() {
    return gulp
      .src('./src/index.html')
      .pipe(inject(gulp.src('./src/app/**/*.js').pipe(angularFilesort()), {
        name: 'app',
        endtag: '<!-- endapp -->',
        relative: true
      }))
      .pipe(gulp.dest('./src'));
  });

  gulp.task('inject-css', ['inject-js'], function() {
    return gulp
      .src('./src/index.html')
      .pipe(inject(gulp.src('./src/styles/*.css', {read: true}).pipe(less()), {
        name: 'app',
        endtag: '<!-- endapp -->',
        relative: true
      }))
      .pipe(gulp.dest('./src'));
  });

  gulp.task('clean-public', function() {
    return gulp
      .src('./public', {read: false})
      .pipe(rimraf({force: true}));
  });

  gulp.task('compile-usemin', ['inject', 'clean-public'], function() {
    return gulp
      .src('./public/index.html')
      .pipe(usemin({
        js: [ngAnnotate(), uglify()],
        css: [cssmin()]
      }))
      .pipe(gulp.dest('./public'));
  });

})();
