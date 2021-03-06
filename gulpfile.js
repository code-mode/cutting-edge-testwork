var gulp = require('gulp');
var sass = require('gulp-sass');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');
var wiredep = require('wiredep').stream;

//основная цепочка
gulp.task('scss', function(){
	gulp.src('app/scss/main.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(minifycss())
		.pipe(rename('style.min.css'))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}));
});

//bower + wiredep, который добавляет нужные скрипты и стили из папки bower в указанное место в <head> index.html
gulp.task('bower', function () {
  gulp.src('./app/index.html')
    .pipe(wiredep({
      directory : "app/bower_components"
    }))
    .pipe(gulp.dest('./app'));
});

//вызов browser-sync для онлайн-слежения за изменениями в браузерах
gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

//слежка изменений
gulp.task('watch', ['browser-sync', 'scss'], function (){
	gulp.watch('app/scss/*.scss', ['scss']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

//определяем какие задачи будут исполнятся по-умолчанию(вызов gulp)
gulp.task('default', ['scss']);



//выгрузка проекта на дистрибьютив
//gulpif - фильтрует файлы, uglify - минифицирует js, minifycss - минифицирует css
gulp.task('build', function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifycss()))
        .pipe(gulp.dest('dist'));
});