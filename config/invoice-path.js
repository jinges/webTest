var root = 'app/invoice';
var tmp_root = 'build/invoice';
var pcpaths = {
    origin:{
        root: root,
        html: {
            source: root + '/*.html',
            build: tmp_root
        },
        components: {
            source: root + '/components/**/*.html'
        },
        images: {
            source: [
                root + '/images/**/*.*',
            ],
            build: tmp_root + '/images'
        },
        styles: {
            source: [
                root + '/sass/*.scss'
            ],
            build: tmp_root + '/css'
        },
        fonts: {
          source: [
            root + '/sass/font/*',
          ],
          build: tmp_root + '/css/font'
        },
        static: {
          source: [
            root + '/static/**/*.*',
          ],
          build: tmp_root + '/static'
        },
        template: root + '/template/**/*.tmpl',
        script: {
            source: [
                root + '/js/libs/template.js',
                root + '/js/libs/zepto.js',
                root + '/js/config.js',
                root + '/js/fetch.js',
                root + '/js/receipt.js',
                root + '/js/invoice.js',
                root + '/js/zxreading.js',
                root + '/js/payoffreceipt.js',
            ],
            build: tmp_root + '/js'
        },
        pub_imgs: './images',
    },
    tmp_root: tmp_root
}

module.exports = pcpaths;