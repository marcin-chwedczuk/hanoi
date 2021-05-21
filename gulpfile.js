// generated on 2016-11-12 using generator-webapp 2.3.2
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();
const del = require('del');
const wiredep = require('wiredep').stream;
const concat = require('gulp-concat');
const rollup = require('rollup-stream');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const babel = require('rollup-plugin-babel');
const includePaths = require('rollup-plugin-includepaths');

const $ = gulpLoadPlugins();

var dev = true;

function prepareStyles() {
  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe(
      $.dartSass.sync({
          outputStyle: 'expanded',
          precision: 10,
          includePaths: ['.']
        })
        .on('error', $.dartSass.logError)
    )
    .pipe($.autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']
    }))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(browserSync.reload({
      stream: true
    }));
}

function prepareScripts() {
  return rollup({
    entry: './app/scripts/main.js',
    format: "iife",
    sourceMap: true,
    plugins: [babel({
      exclude: 'node_modules/**',
      "presets": [
        [
          "es2015-rollup"
        ]
      ],
      "plugins": [
        "external-helpers"
      ]
    }),
    includePaths({
      include: {},
      paths: ['./app/scripts'],
      external: [],
      extensions: ['.js']
    })]
  })

  .pipe(source('app.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({
    loadMaps: true
  }))

  // transform the code further here.

  // if you want to output with a different name from the input file, use gulp-rename here.
  //.pipe(rename('index.js'))

  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('.tmp/scripts'))
  .pipe(browserSync.reload({ stream: true }));
}

function runLinter(files, options) {
  return gulp.src(files)
    .pipe($.eslint({
      fix: true
    }))
    .pipe(browserSync.reload({
      stream: true,
      once: true
    }))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

function lintCode() {
  return runLinter('app/scripts/**/*.js')
    .pipe(gulp.dest('app/scripts'));
}

function lintTests() {
  return runLinter('test/spec/**/*.js')
    .pipe(gulp.dest('test/spec'));
}

function bundleApp() {
  return gulp.src('app/*.html')
    .pipe($.useref({
      searchPath: ['.tmp', 'app', '.']
    }))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssnano({
      safe: true,
      autoprefixer: false
    })))
    .pipe($.if('*.html', $.htmlmin({
      collapseWhitespace: true
    })))
    .pipe(gulp.dest('dist'));
}

const html = gulp.series(prepareScripts, prepareStyles, bundleApp);

function prepareImages() {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin()))
    .pipe(gulp.dest('dist/images'));
}

function prepareFonts() {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', (err) => {})
      .concat('app/fonts/**/*'))
    .pipe($.if(dev, gulp.dest('.tmp/fonts'), gulp.dest('dist/fonts')));
}

function prepareExtras() {
  return gulp.src([
    'app/*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
}

// inject bower components
function prepareBowerCssDependencies() {
  return gulp.src('app/styles/*.scss')
    .pipe($.filter(file => file.stat && file.stat.size))
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));
}

function prepareBowerHtmlDependencies() {
  return gulp.src('app/*.html')
    .pipe(wiredep({
      exclude: ['bootstrap-sass'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
}

const prepareBowerDependencies = gulp.series(
  prepareBowerCssDependencies,
  prepareBowerHtmlDependencies);

function doClean() {
  return gulp.src(['.tmp/*', 'dist/*'], { read: false })
          .pipe($.clean())
          .on('error', $.util.log);
}

function browserSyncReloadTask(done) {
  browserSync.reload();
  done();
}

function doServe() {
  browserSync.init({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'app/*.html',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', browserSyncReloadTask);

  gulp.watch('app/styles/**/*.scss', prepareStyles);
  gulp.watch('app/scripts/**/*.js', prepareScripts);
  gulp.watch('app/fonts/**/*', prepareFonts);
  gulp.watch('bower.json', gulp.series(prepareFonts, prepareBowerDependencies));
}

exports.serve = gulp.series(
  doClean,
  prepareBowerDependencies,
  gulp.parallel(prepareStyles, prepareScripts, prepareFonts),
  doServe);

function doServeDist() {
  browserSync.init({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
}

function doServeTest() {
  browserSync.init({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': '.tmp/scripts',
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('app/scripts/**/*.js', prepareScripts);

  gulp.watch(['test/spec/**/*.js', 'test/index.html'])
    .on('change', browserSyncReloadTask);

  gulp.watch('test/spec/**/*.js', lintTests);
}

exports.serveTest = gulp.series(prepareScripts, doServeTest)

function doBuild() {
  return gulp.src('dist/**/*').pipe($.size({
    title: 'build',
    gzip: true
  }));
}


function setDevFalse(done) {
  dev = false;
  done();
}

exports.clean = gulp.series(doClean)
exports.build = gulp.series(
  lintCode,
  //prepareBowerDependencies,
  prepareScripts,
  prepareStyles,
  bundleApp,
  prepareImages,
  prepareFonts,
  prepareExtras
)
exports.default = gulp.series(
  setDevFalse,
  doClean,
  prepareBowerDependencies,
  exports.build)

exports.serveDist = gulp.series(
  exports.default,
  doServeDist)

exports.listPlugins = function(done) {
  for (let k in $) {
    $.util.log('Plugin available: ' + k)
  }
  done();
}
