const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;


// Style
// =======================

gulp.task('styles', () => {
  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});


// Style minification
// -----------------------

gulp.task('styles-minify', ['styles'], () =>
  gulp.src('.tmp/styles/*.css')
    .pipe($.cssnano({ safe: true, autoprefixer: false }))
    .pipe(gulp.dest('dist/styles'))
);


// Style linting
// -----------------------

gulp.task('sass-lint', () =>
  gulp.src('app/styles/**/*.scss')
    .pipe($.sassLint({
      configFile: '.sass-lint.yml',
    }))
    .pipe($.sassLint.format())
    .pipe($.sassLint.failOnError())
);

gulp.task('scss-lint', ['sass-lint']);


// HTML
// =======================


// HTML minification
// -----------------------


// HTML linting
// -----------------------

gulp.task('html-lint', () =>
  gulp.src('app/*.html')
    .pipe($.html())
);


// Helper
// =======================

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));


// Serving
// =======================

gulp.task('serve', ['styles'], () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
    }
  });

  gulp.watch([
    'app/*.html',
    'app/images/**/*',
  ]).on('change', reload);

  gulp.watch('app/styles/**/*.scss', ['styles']);
});


// Building
// =======================


gulp.task('extras', () => {
  return gulp.src([
    'app/*',
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('build', ['styles-minify', 'extras'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});


// Default
// =======================


