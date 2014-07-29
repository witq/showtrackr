(function(){

  'use strcit';

  var angularFilesort = require('gulp-angular-filesort'),
      bowerFiles      = require('main-bower-files'),
      gulp            = require('gulp'),
      inject          = require('gulp-inject'),
      uglify          = require('gulp-uglify'),
      usemin          = require('gulp-usemin');

  gulp.task('inject', function() {
    gulp
      .src('./src/index.html')
      .pipe(inject(gulp.src(bowerFiles(), {read: false}), {
        name: 'bower',
        endtag: '<!-- endbower -->'
      }))
      .pipe(inject(gulp.src('./src/app/**/*.js').pipe(angularFilesort()), {
        name: 'app',
        endtag: '<!-- endapp -->'
      }))
      .pipe(gulp.dest('./src'));
  });

  gulp.task('usemin', ['inject'], function() {
    gulp
      .src('./src/index.html')
      .pipe(usemin({
        js: [uglify()]
      }))
      .pipe(gulp.dest('./dist'));
  });

  gulp.task('build', ['usemin']);

})();
