"use strict";

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */
 
var http = require("http");
var fs = require('fs');
var port = 5000;

/*
use to start the server when having small files not thousands of fileSize

var chess = fs.readFileSync('images/chess.jpg');
var fern = fs.readFileSynce('images/fern.jpg')
*/

function serveImage(filename, req, res)
{
	var body = fs.readFile('images/' + filename, function(err,body)
		{
			if (err)
			{
				console.error(err);
				res.statusCode = 500;
				resStatusMessage = "whoops";
				res.end("Server Problems");
				return;
			}
			res.setHeader("Content-Type", "image/jpeg");
			res.end(body);
		});	
};

var server = http.createServer(function(req, res) {
	
	switch(req.url)
	{
		case "/bubble":
		case "bubble/":
		case "bubble.jpg":
		case "bubble.jpeg":
			serveImage('bubble.jpg', req, res)
			break;
			
		case "/chess":
		case "chess/":
		case "chess.jpg":
		case "chess.jpeg":
			serveImage('chess.jpg', req, res)
			break;
			
		case "/ace":
		case "ace/":
		case "ace.jpg":
		case "ace.jpeg":
			serveImage('ace.jpg', req, res)
			break;
			
		case "/fern":
		case "fern/":
		case "fern.jpg":
		case "fern.jpeg":
			serveImage('fern.jpg', req, res)
			break;
			
		case "/mobile":
		case "mobile/":
		case "mobile.jpg":
		case "mobile.jpeg":
			serveImage('mobile.jpg', req, res)
			break;
		
		default:
			res.statusCode = 404;
			res.statusMessage = "Not Found";
			res.end("Not Found")
	}		
	
});

server.listen(port, function(){
	console.log("Listening on port " + port);
});

