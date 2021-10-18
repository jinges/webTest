const gulp = require('gulp'),
    concat = require('gulp-concat'),
    contentIncluder = require('gulp-content-includer'),
    minifyHtml = require('gulp-minify-html'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    connect = require('gulp-connect'),
    jshint = require('gulp-jshint'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    fs = require('fs'),
    opn = require('opn'),
    babel = require('gulp-babel'),
    replace = require('gulp-replace'),
    templatejs = require('gulp-templatejs'),
    assetRev = require('gulp-asset-rev');

var paths = {};
var host = '192.168.0.9';


function logError(err) {
    console.log(err.toString());
    this.emit('end');
}

var validateResources = function (resources) {
    resources.forEach(function (resource) {
        if(!resource.match(/\*/) && !fs.existsSync(resource)) {
            throw resource + "not found !";
        }
    });
}

gulp.task('clean', function (cb) {
    del( 'build', cb);
});

gulp.task('concat', function(){
    const v = (+new Date()).toString(32);
    return gulp.src(paths.origin.html.source)
        .pipe(contentIncluder({
            includerReg:/<!\-\-include\s+"([^"]+)"\-\->/g,
            deepConcat: true,
            baseSrc: './'
        }))
        .pipe(replace('./images', paths.origin.pub_imgs))
        .pipe(assetRev({ verStr: "?v="+v }))
        // .pipe(assetRev())
        // .pipe(rename('index.html'))
        .pipe(minifyHtml())
        .pipe(gulp.dest(paths.origin.html.build))
        .pipe(livereload());
});

gulp.task('sass', function () {
    return gulp.src(paths.origin.styles.source)
        .pipe(sass())
        .pipe(concat('style.css'))
        .pipe(gulp.dest(paths.origin.styles.build))
        .pipe(replace('../images', paths.origin.pub_imgs))
        .pipe(minifyCss())
        .pipe(rename({
          extname: '.min.css'
        }))
        .pipe(gulp.dest(paths.origin.styles.build))
        .pipe(livereload());
});

gulp.task('script', function () {
    return gulp.src(paths.origin.script.source)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('app.js'))
        .pipe(gulp.dest(paths.origin.script.build))
        .pipe(uglify())
        .pipe(rename({
          extname: '.min.js'
        }))
        .pipe(gulp.dest(paths.origin.script.build))
        .pipe(livereload());
});

gulp.task('fonts', function(){
    return gulp.src(paths.origin.fonts.source)
        .pipe(gulp.dest(paths.origin.fonts.build))
        .pipe(livereload());
})

gulp.task('static', function(){
    return gulp.src(paths.origin.static.source)
        .pipe(gulp.dest(paths.origin.static.build))
        .pipe(livereload());
})

gulp.task('images', function() {
    return gulp.src(paths.origin.images.source)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.origin.images.build))
        .pipe(livereload());
});


gulp.task('template', function(){
    return gulp.src(paths.origin.template)
        .pipe(livereload());
})



gulp.task('connect', ['concat', 'sass', 'script', 'images','template', 'fonts', 'static'], function () {
    connect.server({
        livereload:true,
        root: paths.tmp_root,
        host: host,
        port: 8080
    });

    livereload.listen();
})

gulp.task('watch', function () {
    gulp.watch(paths.origin.html.source, ['concat']);
    gulp.watch(paths.origin.components.source, ['concat']);
    gulp.watch(paths.origin.styles.source, ['sass']);
    gulp.watch(paths.origin.script.source, ['script']);
    gulp.watch(paths.origin.images.source, ['images']);
    gulp.watch(paths.origin.images.source, ['static']);
    gulp.watch(paths.origin.template, ['template']);
    livereload.listen();
});

gulp.task('web-config', function(){
    var webPath = require('./config/web-path.js');
    paths = webPath;
})

gulp.task('ballot-config', function(){
    var ballotPath = require('./config/ballot-path.js');
    paths = ballotPath;
})
gulp.task('vr-config', function () {
    var vrPath = require('./config/vr-path.js');
    paths = vrPath;
})
gulp.task('game-config', function () {
    var vrPath = require('./config/game-path.js');
    paths = vrPath;
})
gulp.task('votes-config', function () {
    var votePath = require('./config/vote-path.js');
    paths = votePath;
})
gulp.task('group-buy-config', function () {
    var votePath = require('./config/group-buy-path.js');
    paths = votePath;
})
gulp.task('education-config', function () {
    var votePath = require('./config/education-path.js');
    paths = votePath;
})
gulp.task('postcard-config', function () {
    var votePath = require('./config/postcard-path.js');
    paths = votePath;
})
gulp.task('note-config', function () {
    var notePath = require('./config/note-path.js');
    paths = notePath;
})
gulp.task('FC-config', function () {
    var notePath = require('./config/fc-path.js');
    paths = notePath;
})
gulp.task('FM-config', function () {
    var notePath = require('./config/FM-path.js');
    paths = notePath;
})

gulp.task('clock-config', function () {
    var notePath = require('./config/clock-path.js');
    paths = notePath;
})
gulp.task('invoice-config', function () {
    var notePath = require('./config/invoice-path.js');
    paths = notePath;
})



gulp.task('web', ['web-config', 'connect', 'watch'])

gulp.task('ballot', ['ballot-config', 'connect', 'watch'], function(){
   
})

gulp.task('vr', ['vr-config', 'connect', 'watch'], function () {
    
})

gulp.task('game', ['game-config', 'connect', 'watch'], function () {
    opn('http://localhost:8088');
})
gulp.task('votes', ['votes-config', 'connect', 'watch'], function () {
    
})

gulp.task('group-buy', ['group-buy-config', 'connect', 'watch'], function () {
    
})
gulp.task('education', ['education-config', 'connect', 'watch'], function () {
    
})
gulp.task('postcard', ['postcard-config', 'connect', 'watch'], function () {
    
})
gulp.task('note', ['note-config', 'connect', 'watch'], function () {
    
})
gulp.task('fc', ['FC-config', 'connect', 'watch'], function () {
    
})
gulp.task('FM', ['FM-config', 'connect', 'watch'], function () {
 
})
gulp.task('clock', ['clock-config', 'connect', 'watch'], function () {
 
})

gulp.task('invoice', ['invoice-config', 'connect', 'watch'], function () {
 
})



gulp.task('default', ['invoice'], function(){
    opn('http://'+host+':8080');
})
