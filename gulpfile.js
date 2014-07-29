(function(){

  'use strcit';

  var angularFilesort = require('gulp-angular-filesort'),
      bowerFiles      = require('main-bower-files'),
      cssmin          = require('gulp-minify-css'),
      gulp            = require('gulp'),
      inject          = require('gulp-inject'),
      ngAnnotate      = require('gulp-ng-annotate'),
      uglify          = require('gulp-uglify'),
      usemin          = require('gulp-usemin');

  gulp.task('inject', function() {
    gulp
      .src('./src/index.html')
      .pipe(inject(gulp.src(bowerFiles(), {read: false}), {
        name: 'bower',
        endtag: '<!-- endbower -->'
      }))
      .pipe(inject(gulp.src('./src/css/*.css', {read: false}), {
        name: 'app',
        endtag: '<!-- endapp -->'
      }))
      .pipe(inject(gulp.src('./src/app/**/*.js').pipe(angularFilesort()), {
        name: 'app',
        endtag: '<!-- endapp -->'
      }))
      .pipe(gulp.dest('./public'));
  });

  gulp.task('usemin', ['inject'], function() {
    gulp
      .src('./src/index.html')
      .pipe(usemin({
        js: [ngAnnotate(), uglify()],
        css: [cssmin()]
      }))
      .pipe(gulp.dest('./public'));
  });

  gulp.task('build', ['usemin']);

})();
