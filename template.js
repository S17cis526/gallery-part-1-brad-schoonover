var fs = require('fs');
var templates = {}

/** @function loadDir
loads a directory of templates
@param {string} directory
*/
function loadDir(directory)
{
  var dir = fs.readdirSync(directory);
  dir.forEach(function(file)
  {
    var path = directory + '/' + file;
    var stats = fs.statSync(path);
    if(stats.isFile())
    {
      templates[file] = fs.readFileSync(path).toString();
    }
  });
}
/**export

*/

module.exports =
{
  render: render,
  loadDir: loadDir
}

/**
@function render
renders a template with embedded javascript
@param {string} templateName
@param {...}
*/
function render(templateName, context)
{
  return templates[templateName].replace(/<%=(.+)%>/g, function(match, js)
  {
      return eval("var context = " + JSON.stringify(context) + ";" + js);
  });
}
