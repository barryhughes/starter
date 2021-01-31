// Libraries
const {dest, parallel, pipe, series, src, watch} = require('gulp');
const exec = require('gulp-exec');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const minifyHtml = require('gulp-htmlmin');
const minifyJs = require('gulp-uglify');
const sass = require('gulp-sass');

// Paths
const roots = {
    html: "src/html/**/*.html",
    jsDeps: "node_modules/phaser/dist/phaser.min.js",
    js: [
        "src/js/includes/**/*.js",
        "src/js/main.js"
    ],
    output: "out",
    sass: "src/sass/*.scss"
};

const outputPath = "out";

exports.clean = () =>
    src(roots.output, {read: false})
        .pipe(clean());

exports.css = () =>
    src(roots.sass)
        .pipe(sass({outputStyle: "compressed"}))
        .pipe(dest(roots.output));

exports.html = () =>
    src(roots.html)
        .pipe(minifyHtml({collapseWhitespace: true}))
        .pipe(dest(roots.output));

exports.jsDeps = () =>
    src(roots.jsDeps)
        .pipe(concat('deps.js'))
        .pipe(dest(roots.output));

exports.jsSrc = () =>
    src(roots.js)
        .pipe(concat('app.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(minifyJs())
        .pipe(dest(roots.output));

exports.serve = () =>
        exec('node_modules/httpster/bin/httpster out');

exports.js = parallel(exports.jsDeps, exports.jsSrc);

exports.watchHtml = () => watch(roots.html, exports.html);
exports.watchJs = () => watch(roots.js, exports.js);
exports.watchSass = () => watch(roots.sass, exports.css);
exports.watch = parallel(
    exports.watchHtml,
    exports.watchJs,
    exports.watchHtml
);

exports.build = parallel(
    exports.css,
    exports.html,
    exports.js,
);

exports.build = series(
    exports.clean,
    exports.build,
);

exports.default = exports.build;

