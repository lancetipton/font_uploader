
module.exports = function(app, generators, __dirname) { 

	app.get('/', function(req, res){
	  res.sendFile(__dirname + '/views/index.html');
	});

	app.get('/fonts', function(req, res){
		res.setHeader('Content-Type', 'application/json');
		generators.getFonts(function(err, data){
			if(err !== null){
				console.log(err);
	  			res.end(JSON.stringify(err));
			}
			else{
				res.end(JSON.stringify(data));
			}
		});
	});

	app.post('/upload', function(req, res){
		res.setHeader('Content-Type', 'application/json');
		generators.saveFont(req, function(err, data){
			if(err !== null){
	  			res.end(JSON.stringify(err));
			}
			else{
				res.end(JSON.stringify(data));
			}
		});
	});

}