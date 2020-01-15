'use strict';
module.exports = function (grunt) {
    grunt.initConfig({
        opts: {
            /* Filename of the compiled JavaScript file */
            jsName: 'project',

            /* Filename of the compiled CSS file */
            cssName: 'style',
            companyName: 'Ryan Nutt',
            companySite: 'https://www.nutt.net',
            langDomain: 'aelora-post-blocks',
            bugsURL: 'https://github.com/ryannutt/wordpress-post-blocks',

            /* Name of the plugin boot file. This is the one with the plugin header for WordPress. */
            pluginFile: 'post-blocks.php'
        },
        pkg: grunt.file.readJSON('package.json'),
        notify: {
            done: {
                options: {
                    title: '"JavaScript"',
                    message: '"JavaScript code combined and uglified"'
                }
            },
            php: {
                options: {
                    title: '"PHP tasks complete"',
                    message: '"All PHP tasks complete"'
                }
            },
            css: {
                options: {
                    title: '"SCSS tasks complete"',
                    message: '"SCSS files compressed"'
                }
            }
        },
        makepot: {
            target: {
                options: {
                    cwd: '',
                    domainPath: 'lang',
                    exclude: [],
                    include: [],
                    mainFile: '',
                    potComments: '',
                    potFilename: '',
                    potHeaders: {
                        poedit: true,
                        'x-poedit-keywordslist': true,
                        'Report-Msgid-Bugs-To': '<%= opts.bugsURL %>'
                    },
                    processPot: null,
                    type: 'wp-plugin',
                    updateTimestamp: true,
                    updatePoFiles: false
                }
            }
        },
        addtextdomain: {
            options: {
                textdomain: '<%= opts.langDomain %>',
                updateDomains: true
            },
            target: {
                files: {
                    src: [
                        '*.php',
                        '**/*.php',
                        '!node_modules/**',
                        '!tests/**'
                    ]
                }
            }
        },
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: false,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json'],
                createTag: false,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: false,
                pushTo: 'upstream',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace: false,
                prereleaseName: false,
                metadata: '',
                regExp: false
            }
        },
        replace: {
            plugin_php: {
                src: ['<%= opts.pluginFile %>'],
                overwrite: true,
                replacements: [{
                    from: /Version:\s*(.*)/,
                    to: "Version:           <%= pkg.version %>"
                }]
            }
        }
    });
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-wp-i18n');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.registerTask('lang', ['addtextdomain', 'makepot']);

    grunt.registerTask('version', 'Updates version for the plugin', function (step) {
        if (step === undefined) {
            step = 'patch';
        }
        if (!['patch', 'minor', 'major'].includes(step)) {
            grunt.log.writeln('Invalid step for version upgrade:' + step);
            grunt.log.writeln('\n');
            grunt.log.writeln('grunt version - updates patch version\ngrunt version:patch - updates patch version\ngrunt version:minor - updates to next minor version\ngrunt version:major - updates to next major version\n\n');
            return;
        }
        grunt.task.run(['lang', 'bump:' + step, 'readpkg', 'replace:plugin_php']);
    });

    grunt.registerTask('readpkg', 'Read in the package.json file', function () {
        grunt.config.set('pkg', grunt.file.readJSON('./package.json'));
    });
};