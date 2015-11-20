/*
 * multitenant-minifier
 *
 * Copyright (c) 2015 AristaMD
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var async = require('async');
var glob = require('glob');

module.exports = function(grunt) {

    /**
     * Get all the tenants identified by distinct directories in the given src path
     * 
     * @param  {String} srcPath directory containing tenant specific files
     * @return {Array} array of Strings
     */
    this.getTenants = function(srcPath){

        function filter(file){
            return fs.statSync(path.join(srcPath, file)).isDirectory();
        }

        if(fs.existsSync(srcPath)){
            var results = fs.readdirSync(srcPath).filter(filter);
            return results;
        }else{
            return [];
        }
    };

    /**
     * Get all the files in a given directory
     *
     * @param  {String} dir directory to inspect
     * @param  {Array} fileList list of files to add to
     * @return {Array} list of files
     */
    function getFiles(dir,fileList){
        if (!fileList) {
            console.log("Variable 'fileList' is undefined or NULL.");
            return;
        }
        var files = fs.readdirSync(dir);
        for (var i in files) {
            if (!files.hasOwnProperty(i)) continue;
            var name = dir + '/' + files[i];
            if (fs.statSync(name).isDirectory()) {
                getFiles(name, fileList);
            } else {
                fileList.push(name);
            }
        }
    };

    // Why is this here... can we not just set it in the declaration above?
    this.getFiles = getFiles;

    /**
     * Get all the js files for a given module. Assumes modules are located in
     * /js directory
     *
     * @param  {String} module name of the module (directory) to inspect
     * @param  {String} element name of kind of entity in module to include (such as service, directive, etc...)
     * @param  {String} src path tho look for the files
     * @return {Array<String>}
     */
    this.getModuleFiles = function(module, element, src){
        var options = {
            'cwd': src + module
        };
        return glob.sync('js/' + element + '/*.js',options);
    };

    /**
     * Get all the html files for a given module.
     *
     * @param  {String} module name of the module (directory) to inspect
     * @param  {String} src path tho look for the files
     * @return {Array<String>}
     */
    this.getModuleViews = function(module, src){
        var options = {
            'cwd': src + module
        };
        return glob.sync('tpl/*.html',options);
    };

    /**
     * Return a list of files that should not be included for a given module??
     *
     * @param  {[type]} files  [description]
     * @param  {[type]} src    [description]
     * @param  {[type]} module [description]
     * @return {[type]}        [description]
     */
    this.getDeniedFilesForModule = function(files,src,module){
        var deniedFiles = [];
        var fileName = null;
        for (var i in files) {
            deniedFiles.push('!' + src + module + '/' + files[i]);
        }
        return deniedFiles;
    };

    /**
     * [getTenantFilesForModule description]
     * @param  {[type]} files  [description]
     * @param  {[type]} src    [description]
     * @param  {[type]} tenant [description]
     * @param  {[type]} module [description]
     * @return {[type]}        [description]
     */
    this.getTenantFilesForModule = function(files,src,tenant,module){
        var tenantFiles = [];
        var fileName = null;
        for (var i in files) {
            tenantFiles.push( src + tenant  + '/' + module + '/' + files[i]);
        }
        return tenantFiles;
    };
};
