var randomword = require('../libs/parseJSON');

console.log("Running parseJSON tests.");

var jsonData = randomword.parseFileJSON("sampleconfig\randomword\common-3-plus.json");
console.log(jsonData)
