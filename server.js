/**
 Created by Brendan Betts on 2/7/14.
 Email: brendan.betts@live.com
 */

var config = require("./config/config");
var express = require('express');
var http = require('http');
var https = require('https');
var app = express();
var server = http.createServer(app);
var util = require("util");

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/lib'));

app.set("view engine","jade");
app.set("views", __dirname+"/views");

module.exports.app = app;
module.exports.util = util;

routes = require('./routes/routes');
server.listen(config.serverPort);
util.log("Listening on port " +  server.address().port);