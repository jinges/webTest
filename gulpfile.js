import gulp from 'gulp';
import concat  from 'gulp-concat';
import contentIncluder  from 'gulp-content-includer';
import minifyHtml  from 'gulp-minify-html';
import minifyCss  from 'gulp-minify-css';
import uglify  from 'gulp-uglify';
import connect  from 'gulp-connect';
import rename  from 'gulp-rename';
import gulpSass  from 'gulp-sass';
import dartSass from 'sass';
import livereload  from 'gulp-livereload';
import del  from 'del';
import fs  from 'fs';
import opn  from 'opn';
import babel  from 'gulp-babel';
import replace  from 'gulp-replace';
import assetRev  from 'gulp-asset-rev';
import imagemin from 'gulp-imagemin';


import pcpaths from './config/invoice-path.js';

var paths = {};
var sass = gulpSass(dartSass);


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

gulp.task('clean', async function (cb) {
    del( 'build', cb);
});

gulp.task('concat', async function(){
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

gulp.task('sass', async function () {
    console.log(paths.origin.styles.source);
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

gulp.task('script', async function () {
    return gulp.src(paths.origin.script.source)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('app.js'))
        .pipe(gulp.dest(paths.origin.script.build))
        // .pipe(uglify())
        .pipe(rename({
          extname: '.min.js'
        }))
        .pipe(gulp.dest(paths.origin.script.build))
        .pipe(livereload());
});

gulp.task('fonts', async function(){
    return gulp.src(paths.origin.fonts.source)
        .pipe(gulp.dest(paths.origin.fonts.build))
        .pipe(livereload());
})

gulp.task('static', async function(){
    return gulp.src(paths.origin.static.source)
        .pipe(gulp.dest(paths.origin.static.build))
        .pipe(livereload());
})

gulp.task('images', async function() {
    console.log(paths.origin.images.source);
    return gulp.src(paths.origin.images.source)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.origin.images.build))
        .pipe(livereload());
});


gulp.task('template', async function(){
    return gulp.src(paths.origin.template)
        .pipe(livereload());
})



gulp.task('connect', gulp.series('concat', 'sass', 'script', 'images','template', 'fonts', 'static', async function () {
    connect.server({
        livereload:true,
        root: paths.tmp_root,
        port: 8080
    });

    livereload.listen();
}))

gulp.task('watch', async function () {
    gulp.watch(paths.origin.html.source, gulp.series('concat'));
    gulp.watch(paths.origin.components.source, gulp.series('concat'));
    gulp.watch(paths.origin.styles.source, gulp.series('sass'));
    gulp.watch(paths.origin.script.source, gulp.series('script'));
    gulp.watch(paths.origin.images.source, gulp.series('images'));
    gulp.watch(paths.origin.images.source, gulp.series('static'));
    gulp.watch(paths.origin.template, gulp.series('template'));
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
gulp.task('invoice-config', async function () {
    paths = pcpaths;
})



gulp.task('web', gulp.series('web-config', 'connect', 'watch'))

gulp.task('ballot', gulp.series('ballot-config', 'connect', 'watch', function(){
   
}))

gulp.task('vr', gulp.series('vr-config', 'connect', 'watch', function () {
    
}))

gulp.task('game', gulp.series('game-config', 'connect', 'watch', function () {
    opn('http://localhost:8088');
}))
gulp.task('votes', gulp.series('votes-config', 'connect', 'watch', function () {
    
}))

gulp.task('group-buy', gulp.series('group-buy-config', 'connect', 'watch', function () {
    
}))
gulp.task('education', gulp.series('education-config', 'connect', 'watch', function () {
    
}))
gulp.task('postcard', gulp.series('postcard-config', 'connect', 'watch', function () {
    
}))
gulp.task('note', gulp.series('note-config', 'connect', 'watch', function () {
    
}))
gulp.task('fc', gulp.series('FC-config', 'connect', 'watch', function () {
    
}))
gulp.task('FM', gulp.series('FM-config', 'connect', 'watch', function () {
 
}))
gulp.task('clock', gulp.series('clock-config', 'connect', 'watch', function () {
 
}))

gulp.task('invoice', gulp.series('invoice-config', 'connect', 'watch', async function () {
 
}))



gulp.task('default', gulp.series('invoice', async function(){
    opn('http://localhost:8080');
}))

gulp.task('build', gulp.series('invoice'))


