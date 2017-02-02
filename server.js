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

function getImageNames(callback) 
{
	fs.readdir('images/', function(err, fileNames)
	{
		if(err)
		{
			callback(err, undefined);
		}
		else 
		{
			callback(false, fileNames);
		}
		
	});
}

function imageNamesToTags(fileNames){
	return fileNames.map(function(fileName){
		return `<img src = "${fileName}" alt=${fileName}">`;
	});
}

function buildGalley(imageTags)
{
	var html = "<!doctype html><head>";
	html += "<head>";
	html +=  "<title>Gallery</title>"
	html +=  '<link href="gallery.css" rel="stylesheet" type="text/css">'
	html += "</head>";
	html += "<body>";
	html += " <h1>Gallery</h1>";
	html += " <h2> Hello. </h2> Time is " + Date.now();
	html += " <p> " + imageNamesToTags(imageTags).join('') + " <p> ";
	html += "</body>";
	return html;
}

function serveGalley(req, res)
{
	getImageNames(function(err, imageNames)
	{
		if(err)
		{
			console.error(err);
			res.statusCode = 500;
			res.statusMessage = 'Server error'
			res.end();
			return ;
		}		
		res.setHeader('content-Type', 'text/html');
		res.end(buildGalley(imageNames));
	});
}

function serveImage(filename, req, res)
{
	var body = fs.readFile('images/' + filename, function(err,body)
		{
			if (err)
			{
				console.error(err);
				res.statusCode = 404;
				resStatusMessage = "Resource not found";
				res.end("Server Problems");
				return;
			}
			res.setHeader("Content-Type", "image/jpeg");
			res.end(body);
		});	
};

var server = http.createServer(function(req, res) 
{
	
	switch(req.url)
	{
		case '/':
		case '/gallery':
			serveGalley(req, res);
			break;
		case "/gallery.css":
			res.setHeader('Content-Type', 'text/css');
			res.end(stylesheet);
			break;
		default:
			serveImage(req.url, req, res)
			break;
	}		
	
});

server.listen(port, function()
{
	console.log("Listening on port " + port);
});

