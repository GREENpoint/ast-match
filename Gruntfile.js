module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            all: {
                src: ['./node_modules/tv4/tv4.js', './src/ast-match.js'],
                dest: './ast-match.js'
            }
        },
         mochaTest: {
            options: {
                reporter: 'spec'
            },
            all: {
                src: ['test/test.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('default', ['concat:all']);
    grunt.registerTask('test', ['mochaTest:all']);

}
