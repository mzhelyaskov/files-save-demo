module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: [
      'app/static',
      'webapp/dist'
    ],
    exec: {
        build_front: 'cd webapp && npm run build'
    },
    copy: {
      front: {
        files: [{
            expand: true,
            cwd: 'webapp/dist/demo-app/',
            src: ['**'],
            dest: 'app/static/'
        }]
      }
    }
  });

  grunt.registerTask('default', [
    'clean',
    'exec:build_front',
    'copy:front'
  ]);
};