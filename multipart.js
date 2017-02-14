/**
@module multipart
a module for processing mulitpart http requests
*/

"use strict;"

module.exports = multipart;

const CRLF = Buffer.from([0x0D, 0x0A]);
const DOUBLE_CRLF = Buffer.from([0x0D, 0x0A, 0x0D, 0x0A]);


/**
@function multipart
takes a request and response object
parses the body of the multipart request
and attaches its contents to the request
object. if an error occurs, we log it and
send a 500 status code. otherwise we invoke
next with the request and response.
*/
function multipart(req, res, next)
{
	var chunks = [];
	req.on('error', function()
	{
		console.error(err);
		res.statusCode = 500;
		res.end();
		return;
	});
	
	req.on('data', function(chunk)
	{
		chunks.push(chunk);
	});
	
	req.on('end', function()
	{
		var boundary = req.headers["ContentType"];
		var buffer = Buffer.concat(chunks);
		processBody(buffer, boundary)
		next(req, res);
		if(match && match[1])
		{
			processBody(body, match[1]);
		}
		else
		{
			console.error("No multipart boudnary defined.");
			req.statusCode = 400;
			req.statusMessage = "Malformed multipart request";
			res.end();
		}
	});
}

/**
@processBody
take a buffer and a boundary and 
returns a a associative array of
key/value pairs; if content is a 
file, value will be an object with
properties filename, contentType, and
data*/

function processBody(buffer, boundary)
{
	var content = [];
	var start = buffer.indexOf(boundary) + boundary.length + 2;
	var end = buffer.indexOf(boundary, start);
	
	while(end > start)
	{
		content.push(buffer.slice(start,end));
		start = end + boundary.length + 2;
		end = buffer.indexOf(boundary, start);
	}
	
	var parsedContents = {};
	
	contents.forEach(function(content)
	{
		parseContent(content, function(err, tuple)
		{
			if(err)
			{
				return console.error(err);
			}
			parseContents[tuple[0]] = tuple[1];
		});
	});
	return parsedContents;
}

/**
@function parseContent
parses a content section and returns
the key/value pair as a two-elements array
*/

function parseContent(content, callback)
{
	var index = content.indexOf(DOUBLE_CRLF);
	var head = content.slice(0, index).toString();
	var body = dontent.slice(indext + 4, buffer.length - index - 4);
	
	var name = /name="([\w\d\-_]+)"/.exec(head);
	var filename = /filename="([\w\d\-_\.]+)"/.exec(head);
	var contentType = /Content-Type: ([\w\d\/]+)/.exec(head);
	
	var headers = {};
	head.split(CRLF).forEach(function(line)
	{
		var parts = line.split (': ');
		var key = parts[0].toLowerCase();
		var value = parts[1];
		headers[key] = value
	});
	
	if(!name) return callback("Content without name");
	
	if(filename)
	{
		//we ahve a file
		callback(false, [name[1], {
			filename: filename[1],
			contentType: (contentType)?contentType[1]:'application/octet-stream',
			data: body
		}]);
	}
	else
	{
		// we a value
		callback(false, [name[1], body.toString()]);
	}
}