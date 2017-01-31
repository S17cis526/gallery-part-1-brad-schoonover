"use strict";

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */
 
var http = require("http");
var fs = require('fs');
var port = 5000;
var stylesheet = fs.readFileSync('gallery.css')
var imageNames = ['ace.jpg', 'bubble.jpg', 'chess.jpg', 'fern.jpg', 'mobile.jpg']

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
		case '/gallery':
			var gHtml = imageNames.map(function(fileName){
				return ' <img src ="' + fileName + '"alt = "a fishing ace at work">';
			}).join('');
			var html = "<!doctype html><head>";
				html += "<head>";
				html +=  "<title>Gallery</title>"
				html +=  '<link href="gallery.css" rel="stylesheet" type="text/css">'
				html += "</head>";
				html += "<body>";
				html += " <h1>Gallery</h1>";
				html += "<h2> Hello. </h2> Time is " + Date.now();
				html += gHtml
				html += "</body>";
			res.setHeader('content-Type', 'text/html')
			res.end(html)
			break;

		case "/bubble":
		case "/bubble/":
		case "/bubble.jpg":
		case "/bubble.jpeg":
			serveImage('bubble.jpg', req, res);
			break;
			
		case "/chess":
		case "/chess/":
		case "/chess.jpg":
		case "/chess.jpeg":
			serveImage('chess.jpg', req, res);
			break;
			
		case "/ace":
		case "/ace/":
		case "/ace.jpg":
		case "/ace.jpeg":
			serveImage('ace.jpg', req, res);
			break;
			
		case "/fern":
		case "/fern/":
		case "/fern.jpg":
		case "/fern.jpeg":
			serveImage('fern.jpg', req, res);
			break;
			
		case "/mobile":
		case "/mobile/":
		case "/mobile.jpg":
		case "/mobile.jpeg":
			serveImage('mobile.jpg', req, res);
			break;
			
		case "/gallery.css":
			res.setHeader('Content-Type', 'text/css');
			res.end(stylesheet);
			break;
		default:
			res.statusCode = 404;
			res.statusMessage = "Not Found";
			res.end("Not Found");
			break;
	}		
	
});

server.listen(port, function(){
	console.log("Listening on port " + port);
});

