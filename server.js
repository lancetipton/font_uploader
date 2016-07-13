var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var http = require('http').Server(app);
var q = require('q');
var filepath = require('filepath');
var generators = require('./filesys/generators.js')(__dirname);

var $ = require('jquery');

app.use('/',express.static(__dirname + ''));


// Rout to set your main index.html file:
app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});


app.post('/upload', function(req, res){

	generators.saveFont(req, function(err, data){
		if(err !== null){
  			res.send({error: true, info: 'Could not save font!'});
		}
		else{
			res.end('success');
		}
	});




});

var port_number = http.listen(process.env.PORT || 8080);
app.listen(port_number);


