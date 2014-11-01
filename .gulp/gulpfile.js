/**
 * Created by tsuguya on 14/11/01.
 */
var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var please = require('gulp-pleeease');

gulp.task('sass', function () {
    return gulp.src('sass/*.sass')
        .pipe(sass())
        .pipe(please({
            minifier: false
        }))
        .pipe(gulp.dest('../css/'));
});

gulp.task('watch', function() {
    gulp.watch('sass/*.sass', ['sass']);
});

gulp.task('default', ['sass', 'watch']);