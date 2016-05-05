exports.parseFileJSON = function(filepath)
{
  var request = new XMLHttpRequest();
  request.open("GET", filepath, false);
  request.send();

  console.log("Request status: " + request.status)
  if(request.status >= 200 && request.status < 300)
  {
    console.log("File contents: " + request.responseText)
  }

  var returnJSON = JSON.parse(request.responseText);
  alert(returnJSON[0])

  return returnJSON;
}