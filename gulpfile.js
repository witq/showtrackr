(function(){

  'use strcit';

  var angularFilesort = require('gulp-angular-filesort'),
      bowerFiles      = require('main-bower-files'),
      cssmin          = require('gulp-minify-css'),
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
  gulp.task('build', ['inject', 'copy']);
  gulp.task('clean', ['clean-public']);
  gulp.task('copy', ['copy-app', 'copy-bower']);
  gulp.task('inject', ['inject-bower', 'inject-js', 'inject-css']);

  // Watchers

  gulp.task('watch', ['build'], function() {

    gulp.watch(['./src/**/*', '!./src/vendor/**/*'], ['build']);

  });


  // Subtasks

  gulp.task('less', function() {
    return gulp
      .src('./src/styles/**/*.less', {base: './src'})
      .pipe(less())
      .pipe(gulp.dest('./src'));
  });

  gulp.task('copy-app', ['clean-public'], function() {
    return gulp
      .src(['./src/**/*.js', './src/**/*.html', './src/styles/**/*.css', '!./src/vendor/**/*'], {base: './src', read: true})
      .pipe(gulp.dest('./public'));
  });

  gulp.task('copy-bower', ['clean-public'], function() {
    return gulp
      .src(bowerFiles(), {base: './src', read: true})
      .pipe(gulp.dest('./public'));
  });

  gulp.task('inject-bower', ['clean-public'], function() {
    return gulp
      .src('./src/index.html')
      .pipe(inject(gulp.src(bowerFiles(), {read: false}), {
        name: 'bower',
        endtag: '<!-- endbower -->',
        relative: true
      }))
      .pipe(gulp.dest('./src'));
  });

  gulp.task('inject-js', ['clean-public'], function() {
    return gulp
      .src('./src/index.html')
      .pipe(inject(gulp.src('./src/app/**/*.js').pipe(angularFilesort()), {
        name: 'app',
        endtag: '<!-- endapp -->',
        relative: true
      }))
      .pipe(gulp.dest('./src'));
  });

  gulp.task('inject-css', ['clean-public', 'less'], function() {
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
      .src('./src/index.html')
      .pipe(usemin({
        js: [ngAnnotate(), uglify()],
        css: [cssmin()]
      }))
      .pipe(gulp.dest('./public'));
  });

})();
