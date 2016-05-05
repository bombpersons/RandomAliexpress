var endpointURL = 'http://api.wordnik.com:80/v4/words.json/randomWord';
var optStart = '?';
var optSep = '&';
var httpMethod = 'GET';
var asyncronous = false;


exports.getRandomWord = function(apiKey)
{
  var xhr = new XMLHttpRequest();

  var apiKeyOption = 'api_key' + '=' + apiKey;
  var fullRequestString = endpointURL + optStart + apiKeyOption;

  xhr.open(httpMethod, fullRequestString, asyncronous);
  xhr.setRequestHeader('Content-Type', 'application/json');

  console.log("Requesting word...");

  xhr.send()

  return xhr.responseText;
}
