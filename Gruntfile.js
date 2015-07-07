var path = 'frontend-patterns-mapsite/'

module.exports = function(grunt) {

  grunt.initConfig({

    jshint: {
      js: [path + 'dev/js/main.js']
    },

    csslint: {
      css: {
        options: {
          import: false
        },
        src: [path +'dev/css/*.css']
      }
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: path + 'dev/css',
          src: [ '*.css', '!*.min.css' ],
          dest: path + 'dev/css',
          ext: '.min.css'
        }]
      }
    },

    uglify: {
      targets: {
        files: [{
          expand: true,
          cwd: path + 'dev/js',
          src: ['*.js', '!*.min.js', '!knockout-3.3.0.js'],
          dest: path + 'dev/js',
          ext: '.min.js'
        }]
      }
    },

    // use min'd files in prod version of index.html
    /*replace: {
      html: {
        src: [path + 'dev/index.html'],
        dest: path + 'dev/index2.html',
        replacements: [{
          from: 'css/main.css',
          to: 'css/main.min.css'
        },
        {
          from: 'js/jQuery.js',
          to: 'js/jQuery.min.js'
        },
        {
          from: 'js/main.js',
          to: 'js/main.min.js'
        }]
      }
    },*/

    htmlmin: {
      html: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: path + 'dev',
          src: '*.html',
          dest: path + 'prod',
          ext: '.html'
        }]
      }
    },

    imagemin: {
      images: {
        files: [{
          expand: true,
          cwd: path + 'dev/images',
          src: ['**/*.{png,jpg,gif}'],
          dest: path + 'prod/images'
        },
        {
          expand: true,
          cwd: path + 'dev/icons',
          src: ['**/*.png'],
          dest: path + 'prod/icons'
        }]
      }
    },

    copy: {
      js: {
        files: [{
          expand:true, 
          cwd: path + 'dev/js/',
          src: ['*.min.js'], 
          dest: path + 'prod/js/'
        }]
      },
      css: {
        files: [{
          expand:true,
          cwd: path + 'dev/css/',          
          src: ['*.min.css'], 
          dest: path + 'prod/css/'
        }]
      }
    },

    // Order: jslint, csslint, concat (css), cssmin, uglify (js), htmlmin
    watch: {
      js: {
        files: [path + 'dev/js/*.js', '!' + path + 'dev/js/*.min.js'], // watch all js files for changes
        tasks: ['jshint', 'uglify', 'copy:js']
      },
      html: {
        files: [path + 'dev/*.html'], // watch all js files for changes
        tasks: ['htmlmin']
      },
      css: {
        files: [path + 'dev/css/*.css', '!' + path + 'dev/css/*.min.css'],
        tasks: ['csslint', 'cssmin', 'copy:css']
      },
      images: {
        files: [path + 'dev/images/*', path + 'dev/icons/*.png'],
        tasks: ['imagemin']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-text-replace');

  grunt.registerTask('default', ['jshint', 'uglify', 'htmlmin',
    'csslint', 'cssmin', 'imagemin', 'copy', 'watch'
  ]);
  grunt.registerTask('js', ['jshint', 'uglify', 'copy:js']);
  grunt.registerTask('css', ['csslint', 'cssmin', 'copy:css']);
  grunt.registerTask('html', 'htmlmin');
  grunt.registerTask('image', 'imagemin');
  grunt.registerTask('watching', 'watch');
};