// **** MODULES **** //
const babelify    = require('babelify')
const babel       = require('babel-core')
const browserify  = require('browserify')
const fs          = require('fs')
const gulp        = require('gulp')
const sourcemaps  = require('gulp-sourcemaps')
const uglify      = require('gulp-uglify')
const gutil       = require('gulp-util')
const buffer      = require('vinyl-buffer')
const source      = require('vinyl-source-stream')



// **** PATHS **** //
const paths = {
  src  : './src/',
  dist : './dist/'
}



const deleteFolderRecursive = path => {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      var curPath = path + "/" + file
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}



// // **** ERROR HANDLING **** //
// // (ref. https://gist.github.com/noahmiller/61699ad1b0a7cc65ae2d)

// // let watching = false

// // Command line option:
// //  --fatal=[warning|error|off]
const ERROR_LEVELS = ['error', 'warning']

// // Return true if the given level is equal to or more severe than
// // the configured fatality error level.
// // If the fatalLevel is 'off', then this will always return false.
// // Defaults the fatalLevel to 'error'.
// isFatal = (level) => {
//   ERROR_LEVELS.indexOf(level) <= ERROR_LEVELS.indexOf(fatalLevel || 'error')
// }

// // Handle an error based on its severity level.
// // Log all levels, and exit the process for fatal levels.
// // ref. http://stackoverflow.com/questions/21602332/catching-gulp-mocha-errors#answers
handleError = (level, error) => {
  gutil.log(error.message)
  // if isFatal(level)
  //   process.exit(1)
  // if (watching) {
  //   this.emit('end')
  // } else {
  process.exit(1)
  // }
}

// // Convenience handler for error-level errors.
onError = error => handleError.call(this, 'error', error)
// // Convenience handler for warning-level errors.
onWarning = error => handleError.call(this, 'warning', error)



// **** TASKS **** //
gulp.task('js', () => {
  browserify(paths.src + 'main.js', { debug: true })
    .transform(babelify)
    .bundle().on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('things.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify({ mangle: false })).on('error', onError)
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(paths.dist)).on('error', onError)
})

gulp.task('clean', () => {
  deleteFolderRecursive(paths.dist)
})

gulp.task('build', ['js'])

gulp.task('refresh', ['clean', 'build'])

gulp.task('default', ['refresh'])
