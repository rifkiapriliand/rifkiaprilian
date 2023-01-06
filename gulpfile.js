const { src, dest, watch, series }               = require("gulp");
const autoprefixer                               = require("gulp-autoprefixer");
const concat                                     = require("gulp-concat");
const copy                                       = require('gulp-copy');
const postcss                                    = require("gulp-postcss");
const pug                                        = require("gulp-pug");
const rename                                     = require("gulp-rename");
const sass                                       = require("gulp-sass")(require("sass"));
const sourcemaps                                 = require("gulp-sourcemaps");
const strip                                      = require("gulp-strip-comments");
const terser                                     = require("gulp-terser");
const resolveDependencies                        = require("gulp-resolve-dependencies");
const tildeImporter                              = require("node-sass-tilde-importer");
const merge                                      = require('merge-stream');
const browsersync                                = require("browser-sync").create();

// Pug Task
function pugTask() {
    return src("./src/pug/index.pug")
        .pipe(pug({
            pretty: true
        }))
        .pipe(dest("./"));
}

// Sass Task
function scssTask() {
    return src("./src/scss/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass({
            importer: tildeImporter
        }))
        .pipe(postcss([require('autoprefixer')]))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(sourcemaps.write("."))
        .pipe(dest("./assets/css"));
}

// Theme Js Task
function jsThemeTask() {
    return src("./src/js/theme.js")
        .pipe(sourcemaps.init())
        .pipe(resolveDependencies({
            pattern: /\* @requires [\s-]*(.*\.js)/g
        }))
        .pipe(concat("theme.js"))
        .pipe(strip())
        .pipe(terser({}, terser.minify))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(sourcemaps.write("."))
        .pipe(dest("./assets/js"));
}

// Vendor Js Task
function jsVendorTask() {
    return src("./src/js/vendor.js")
        .pipe(sourcemaps.init())
        .pipe(resolveDependencies({
            pattern: /\* @requires [\s-]*(.*\.js)/g
        }))
        .pipe(concat("vendor.js"))
        .pipe(strip())
        .pipe(terser({}, terser.minify))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(sourcemaps.write("."))
        .pipe(dest("./assets/js"));
}

// Copy Task
function copyTask() {
    var images = src( "./src/images/**" )
                .pipe(copy("./assets", { prefix: 1 }))
    var fonts = src( "./src/fonts/**" )
                .pipe(copy("./assets", { prefix: 1 }))
    return merge(images, fonts);
}

// Browsersync Task
function browsersyncServe(cb) {
    browsersync.init({
        server: {
            baseDir: "./",
            index: "./index.html"
        }
    });
    cb();
}

function browsersyncReload(cb) {
    browsersync.reload();
    cb();
}

// Watch Task
function watchTask() {
    watch("./src/pug/**/*.pug", series(pugTask, browsersyncReload));
    watch("./src/scss/**/*.scss", series(scssTask, browsersyncReload));
    watch("./src/js", series(jsThemeTask, jsVendorTask, browsersyncReload));
    watch("./src/**", series(copyTask, browsersyncReload));
}

// Default Gulp Task
exports.default = series(
    copyTask,
    scssTask,
    jsThemeTask,
    jsVendorTask,
    pugTask,
    browsersyncServe,
    watchTask
)