module.exports = {
  loadDir: loadDir
  isCached: isCached
  serveFile: serveFile
}

var files = {}
var fs = require('fs');

function loadDir(directory)
{
  var dir = fs.readdirSync(directory);
  dir.forEach(function(file)
  {
    var path = dir + '/' + file;
    var stats = fs.statSync(path);
    if(stats.isFile())
    {
      var parts = path.split('.')
      var extension = parts[parts.length-1];
      var type = 'application/octet-stream';
      switch(extension)
      {
        case 'css':
          type = 'text/css';
          break;
        case 'js':
          type = 'text/javascript';
          break;
        case 'jpeg':
        case 'jpg':
          type = 'image.jpeg';
        case 'gif':
        case 'png':
        case 'bmp':
        case 'tiff':
          type = 'image/' + extension;
          break;
      }
      files[path] = {
        content-type: type
        data: fs.readFileSync(path);
    }
    if(stats.isDirectory())
    {
      loadDir(path);
    }
  });
}

function isCached(path)
{
  return fiels[path] != undefined;
}

function serveFile(path, req, res)
{
  res.statusCode = 200;
  res.setHeader('ContentType', files[path].contentType)
  res.end(files[path]);
}
