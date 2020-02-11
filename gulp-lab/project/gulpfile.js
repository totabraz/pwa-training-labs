const gulp = require('gulp');
const browserSync = require('browser-sync');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
let cleanCss = require('gulp-clean-css');

function copy() {
    return gulp.src([
        'app/*.html',
        'app/**/*.jpg',
        // 'app/**/*.css',// will be process on processCss()
        // 'app/**/*.js', // will be process on processJS()
    ])
        .pipe(gulp.dest('build'))
}

gulp.task('copy', copy);

function serve() {
    return browserSync.init({
        server: 'build',
        open: false,
        port: 3000
    });
}


function processCss() {
    return gulp.src('app/styles/*.css')
        .pipe(cleanCss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('build/styles'))
}
gulp.task('processCss', processCss)

function processJS() {
    return gulp.src('app/scripts/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('build/scripts'))
}

gulp.task('processJS', processJS)

function watch() {
    gulp.watch('app/scripts/*.js', processJS);
    gulp.watch('app/styles/*.css', processCss);
}
gulp.task('watch', watch);

gulp.task(
    'buildAndServe',
    gulp.series(
      copy, processJS, processCss,
      gulp.parallel(serve, watch)
    )
  );