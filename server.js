"use strict";

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */

var http = require("http");
var fs = require('fs');
var multipart = require("./multipart");
var template = require('./template');
var port = 5000;
var stylesheet = fs.readFileSync('public/gallery.css');
var script = fs.readFileSync('public/gallery.js');
//var imageNames = ['ace.jpg', 'bubble.jpg', 'chess.jpg', 'fern.jpg', 'mobile.jpg']
// var config =
// {
	// title: "Gallery"
// }
var config = JSON.parse(fs.readFileSync('config.json'));
var url = require('url');

template.loadDir('templates');

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
  return template.render('gallery.html',
  {
    title: config.title,
    imageTags: imageNamesToTags(imageTags).join('')
  });

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
				res.statusMessage = "Resource not found";
				res.end("Server Problems");
				return;
			}
			res.setHeader("Content-Type", "image/jpeg");
			res.end(body);
		});
};

function uploadImage(req, res)
{
	multipart(req, res, function(req, res)
	{
		if(!req.body.image.filename)
		{
			console.error("No file in upload");
			res.statusCode = 400;
			res.statusMessage = "No file specified";
			res.end("No file specified");
			return;
		}
		fs.writeFile('images/' + req.body.image.filename, req.body.image.data, function(err)
		{
			if(err)
			{
				console.error(err);
				res.statusCode = 500;
				res.statusMessage = "Server Error";
				res.end("Server Error");
				return;
			}
			serveGallery(req, res);
		});
	});
	// var body = '';
	// req.on('error', function()
	// {
		// res.statusCode = 500;
		// res.end();
	// });
	// req.on('data', function(data)
	// {
		// body += data
	// });
	// req.on('end', function()
	// {
		// fs.writeFile('filename', body, function(err)
		// {
			// if(err)
			// {
				// console.error(err);
				// res.statusCode = 500;
				// res.end();
				// return;
			// }
			// serveGallery(req, res);
		// });
	// });
}

var server = http.createServer(function(req, res)
{
	var urlParts = url.parse(req.url);

	// var url = req.url.split('?');
	// var resource = url[0];
	// var queryString = url[1];

	if(urlParts.query)
	{
		var matches = /title=(.+)($|&)/.exec(urlParts.query);
		if(matches && matches[1])
		{
			config.title = decodeURIComponent(matches[1]);
			fs.writeFile('config.json',JSON.stringify(config));
		}
	}

	switch(urlParts.pathname)
	{
		case '/':
		case '/gallery':
			if(req.method == 'GET')
			{
				serveGalley(req, res);
			}
			else if(req.method == 'POST')
			{
				uploadImage(req, res);
			}
			break;
		case "/gallery.css":
			res.setHeader('Content-Type', 'text/css');
			res.end(stylesheet);
			break;
		case '/gallery.js':
		  res.setHeader('Content-Type', 'text/javascript');
			res.end(script);
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
