
module.exports = function(app, font_actions, __dirname) { 

	// Landing page route:
	app.get('/', function(req, res){
	  res.sendFile(__dirname + '/views/index.html');
	});

	// Route to get all the fonts loaded on the server:
	app.get('/fonts', function(req, res){
		// Set the headers to use json:
		res.setHeader('Content-Type', 'application/json');

		// Call the getFonts function to get our fonts:
		font_actions.getFonts(function(err, data){
			if(err !== null){
				// Log and return an error, if there was one:
				console.log(err);
	  			res.end(JSON.stringify(err));
			}
			else{
				// Return out fonts to the client:
				res.end(JSON.stringify(data));
			}
		});
	});

	app.post('/upload', function(req, res){
		// Set the headers to use json:
		res.setHeader('Content-Type', 'application/json');

		//  Call the saveFont function to save our font:
		font_actions.saveFont(req, function(err, data){
			if(err !== null){
				// Log and return an error, if there was one:
				console.log(err);
	  			res.end(JSON.stringify(err));
			}
			else{
				// return the font status:
				res.end(JSON.stringify(data));
			}
		});
	});

}