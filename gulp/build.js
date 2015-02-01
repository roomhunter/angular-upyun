'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'del']
});

var rename = require('gulp-rename');

gulp.task('js', [], function () {

  return gulp.src(paths.src + '/upyun.js')
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe(rename("upyun.min.js"))
    .pipe(gulp.dest(paths.dist + '/'));
});

gulp.task('clean', function (done) {
  $.del([paths.dist + '/', paths.tmp + '/'], done);
});

gulp.task('build', ['js']);
