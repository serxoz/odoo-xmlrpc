/*
*
* Author: Faisal Sami
* mail: faisalsami78@gmail.com
* https://github.com/faisalsami/odoo-xmlrpc
*
*
*/
var xmlrpc = require('xmlrpc');
var url = require('url');

var Odoo = function (config) {
    config = config || {};

    var urlparts = url.parse(config.url);
    this.host = urlparts.hostname;
    this.port = config.port || urlparts.port;
    this.db = config.db;
    this.username = config.username;
    this.password = config.password;
    this.secure = true;
    if(urlparts.protocol !== 'https:') {
      this.secure = false
    }
    var uid = 0;

    this.connect = function(){
        var clientOptions = {
            host: this.host,
            port: this.port,
            path: '/xmlrpc/2/common'
        }
        var client;
        if(this.secure == false) {
          client = xmlrpc.createClient(clientOptions);
        }
        else {
          client = xmlrpc.createSecureClient(clientOptions);
        }
        var params = [];
        params.push(this.db);
        params.push(this.username);
        params.push(this.password);
        params.push({});
        return new Promise((resolve, reject) => {
          client.methodCall('authenticate', params, function(error, value) {
            if(error){
              return reject(new Error(error))
            }
            if(!value){
              return reject(new Error("No UID returned from authentication."))
            }
            uid = value;
            return resolve(value)
          });
        });
    };
    this.execute_kw = function(model, method, params){
        var clientOptions = {
            host: this.host,
            port: this.port,
            path: '/xmlrpc/2/object'
        }
        var client;
        if(this.secure == false) {
          client = xmlrpc.createClient(clientOptions);
        }
        else {
          client = xmlrpc.createSecureClient(clientOptions);
        }
        var fparams = [];
        fparams.push(this.db);
        fparams.push(uid);
        fparams.push(this.password);
        fparams.push(model);
        fparams.push(method);
        for(var i = 0; i <params.length; i++){
            fparams.push(params[i]);
        }
        return new Promise((resolve, reject) => {
          client.methodCall('execute_kw', fparams, function(error, value) {
            if(error){
              return reject(new Error(error))
            }
            return resolve(value);
          });
        })
    };
    this.exec_workflow = function(model, method, params){
        var clientOptions = {
            host: this.host
            , port: this.port
            , path: '/xmlrpc/2/object'
        }
        var client;
        if(this.secure == false) {
          client = xmlrpc.createClient(clientOptions);
        }
        else {
          client = xmlrpc.createSecureClient(clientOptions);
        }
        var fparams = [];
        fparams.push(this.db);
        fparams.push(uid);
        fparams.push(this.password);
        fparams.push(model);
        fparams.push(method);
        for(var i = 0; i <params.length; i++){
            fparams.push(params[i]);
        }
        return new Promise((resolve, reject) => {
          client.methodCall('exec_workflow', fparams, function(error, value) {
            if(error){
              return reject(new Error(error))
            }
            return resolve(value);
          });
        });
    };
    this.render_report = function(report, params){
        var clientOptions = {
            host: this.host
            , port: this.port
            , path: '/xmlrpc/2/report'
        }
        var client;
        if(this.secure == false) {
          client = xmlrpc.createClient(clientOptions);
        }
        else {
          client = xmlrpc.createSecureClient(clientOptions);
        }
        var fparams = [];
        fparams.push(this.db);
        fparams.push(uid);
        fparams.push(this.password);
        fparams.push(report);
        for(var i = 0; i <params.length; i++){
            fparams.push(params[i]);
        }
        return new Promise((resolve, reject) => {
          client.methodCall('render_report', fparams, function(error, value) {
            if(error){
              return reject(new Error(error));
            }
            return resolve(value);
          });
        });
    };
};

module.exports = Odoo;