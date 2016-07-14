var express = require('express');
var app = express();
var http = require('http').Server(app);
var generators = require('./filesys/generators.js')(__dirname);
var routes = require('./routes/routes.js')(app, generators, __dirname);

app.use('/',express.static(__dirname + ''));

var port_number = http.listen(process.env.PORT || 8080);
app.listen(port_number);


