# Gulp stuff.
gulp = require('gulp')
gutil = require('gulp-util')
coffee = require('gulp-coffee')
sourcemaps = require('gulp-sourcemaps')
touch = require('touch')
path = require('path')
tap = require('gulp-tap')
parallelize = require("concurrent-transform")

threads = 100
coffeeFiles = ['app/**/*.coffee','test/**/*.coffee','gulfile.coffee', 'app.coffee', 'routes/*.coffee', 'config.coffee']

gulp.task('touch', () ->
    gulp.src(coffeeFiles)
    .pipe(
        tap((file, t) ->
            touch(file.path)
        )
    )
)

gulp.task('coffeescripts', () ->
    gulp.src(coffeeFiles)
    .pipe(sourcemaps.init())
    .pipe(parallelize(coffee({bare: true}).on('error', gutil.log), threads))
    .pipe(parallelize(sourcemaps.write('./'), threads))
    .pipe(parallelize(gulp.dest((file) -> return file.base), threads))
)

gulp.task('watch', () ->
    gulp.watch(coffeeFiles, ['coffeescripts'])
)

gulp.task('default', ['watch', 'coffeescripts'])

gulp.task('done', (() -> ))
