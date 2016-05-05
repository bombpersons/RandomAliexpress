var randomword = require('../libs/randomword');
var wordnikKey = require('../config/wordnik-key');

console.log("Running randomword tests.");
//console.log("Using wordnik key: " + wordnikKey.api_key);

for(i = 0; i < 10; ++i)
{
  var word = randomword.getRandomWord(wordnikKey.api_key);
  console.log(word)
}
