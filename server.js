'use strict'
var http = require('http');
var io = require('socket.io');
var express = require('express');
var PORT = process.env.PORT || 8080;

var app = express();
var server = http.createServer(app);

app.use(express.static(__dirname + '/static'))
server.listen(PORT, function() {
	console.log("server is listening on port", PORT);
});

io = io.listen(server);

module.exports = io
