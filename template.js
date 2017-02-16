var fs = require('fs');

/**export

*/

module.exports =
{
  render: render
}

/**
@function render
renders a template with embedded javascript
@param {string} templateName
@param {...}
*/
function render(templateName, context)
{
  var html = fs.readFileSync('templates/' + templateName + '.html');
  html = html.toString().replace(/<%=(.+)%>/g, function(match, js)
  {
      return eval("var context = " + JSON.stringify(context) + ";" + js);
  });
  return html;
}
