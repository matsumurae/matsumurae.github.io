const gulp = require('gulp');
const autoprefixer = require("gulp-autoprefixer");
const notify = require("gulp-notify");
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const csscomb = require('gulp-csscomb');
const imagemin = require('gulp-imagemin');
const runSeq = require('run-sequence');

const autoprefixerOptions = {
    browsers: [
        'ie >= 9',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10'
    ]
};

// IMG
//--------------------------------------------------------
// Copy images and minify
gulp.task('img', function() {
    gulp.src('./src/img/**/*.**')
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(gulp.dest('./dist/img/'));
});

// FONTS
//--------------------------------------------------------
gulp.task('fonts', function() {
    gulp.src('./src/fonts/**/*.**')
        .pipe(gulp.dest('./dist/fonts/'));
});

// Minify tasks
//--------------------------------------------------------
gulp.task('mincss', function() {
    return gulp.src('./dist/main.css')
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(csscomb())
        .pipe(cleanCSS())
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('./dist'));
});

// Watch tasks
//--------------------------------------------------------
// sass
gulp.task('default', function() {
    console.log("start watching sass files...")
    gulp.watch('./src/themes/**/*.scss', ['sass']);
});

// Sass tasks
//--------------------------------------------------------
gulp.task('sass', function() {
    return gulp.src(
            ["./src/themes/**/*.scss"], {
                sourcemaps: true,
                loadMaps: true
            })
        .pipe(sourcemaps.init())
        // .pipe(sass().on('error', sass.logError))
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'expanded'
        })).on("error", notify.onError({
            message: 'SASS compile error: <%= error.message %>'
        }))
        .pipe(sourcemaps.write())
        .pipe(csscomb())
        .pipe(rename('main.css'))
        .pipe(gulp.dest('./dist'));
});

// Deploy
//--------------------------------------------------------
gulp.task('deploy', function() {
    runSeq('sass', 'mincss', 'img', 'fonts');
});