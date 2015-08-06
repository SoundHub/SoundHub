var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var nodemon = require('gulp-nodemon');

function compile(watch) {
  var bundler = watchify(browserify('./app/client.js', { debug: true }).transform(babel));

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('build.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./app/build'));
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling JS...');
      rebundle();
    });

  }

  rebundle();
}

function watch() {
  return compile(true);
};

gulp.task('sass', function() {
  console.log('-> bundling CSS...');
  gulp.src('./app/scss/**/*.scss')
    .pipe(sass())
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('./app/build'));
});

gulp.task('build', function() { return compile(); });
gulp.task('watch', function() {
  gulp.watch('./app/scss/**/*.scss', ['sass']);
  nodemon({
    script: 'app/server.js'
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development' }
  })
  return watch();
});
gulp.task('default', ['build','sass','watch']);
