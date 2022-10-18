var fs = require('fs-extra');
var path = require('path');
var gulp = require('gulp');
var install = require('gulp-install');
var sourcemaps = require('gulp-sourcemaps');
var tsc = require('gulp-typescript');
var del = require('del');

var BUILD_DIR = '_build';
var CLIENT_DIR = 'client';
var SERVER_DIR = 'server';

var metadata = {
    files: [
        '!**/node_modules/**/*',
        `${CLIENT_DIR}/.env`,
        `${SERVER_DIR}/.env`,
    ]
}

var projects = [
    // CLIENT_DIR,
    SERVER_DIR,
]

gulp.task('install_deps', done => {
    projects.forEach(project => {
        gulp.src('package.json', { cwd: path.join(__dirname, project) })
            .pipe(install())
            .pipe(gulp.dest(path.join(BUILD_DIR, project)))
            .pipe(install({ production: true }));
    });
    done();
});

gulp.task('make', done => {
    projects.forEach(project => {
        var tsProject = tsc.createProject(path.join(project, 'tsconfig.json'));
        tsProject.src()
            .pipe(sourcemaps.init())
            .pipe(tsProject())
            .pipe(sourcemaps.write('.', { sourceRoot: path.join(__dirname, project), includeContent: false }))
            .pipe(gulp.dest(path.join(BUILD_DIR, project)));
    });
    done();
});

gulp.task('metadata', () => {
    return gulp.src(metadata.files, { base: __dirname, dot: true, allowEmpty: true })
        .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('clean_build', () => {
    return del(BUILD_DIR);
});

gulp.task('clean_deps', done => {
    del(path.join(CLIENT_DIR, 'node_modules'));
    del(path.join(SERVER_DIR, 'node_modules'));
    del(path.join(BUILD_DIR, CLIENT_DIR, 'node_modules'));
    del(path.join(BUILD_DIR, SERVER_DIR, 'node_modules'));
    done();
});

gulp.task('clean_dev_deps', done => {
    fs.remove(path.join(__dirname, 'node_modules'));
    done();
});

gulp.task("clean", gulp.series('clean_build'));
gulp.task('clean_all', gulp.parallel('clean_deps', 'clean_build', 'clean_dev_deps'));
gulp.task('install', gulp.parallel('install_deps'));
gulp.task('build', gulp.series('make', 'metadata'));
gulp.task('default', gulp.series('clean', 'install', 'build'));
