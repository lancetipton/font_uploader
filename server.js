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

// the server
http.listen(8080, function(){
  console.log('listening on *:8080');
});


