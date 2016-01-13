// Get's a random product from a page of items.
exports.findproduct = function(url) {
  // Open up a page...
  var page = require('webpage').create();
  page.onConsoleMessage = function(msg) { console.log(msg); };

  page.onError = function (msg, trace) {
      console.log(msg);
      trace.forEach(function(item) {
          console.log('  ', item.file, ':', item.line);
      });
  };

  console.log('Opening page: ' + url);
  page.open(url, function(status) {
    console.log('Status: ' + status);
    if (status === 'success') {
      console.log('hey');

      // Get the total page count.
      var totalResultCount = page.evaluate(function() {
        var countTag = document.getElementsByClassName('search-count');
        return countTag[0].innerHTML;
      });
      // Get rid of commas
      totalResultCount = totalResultCount.replace(',', '');

      // Get the amount of items per page
      var itemsPerPageCount = page.evaluate(function() {
        var resultListTags = document.getElementsByClassName('list-item');
        return resultListTags.length;
      });

      console.log('Results: ' + totalResultCount);
      console.log('Results per page: ' + itemsPerPageCount);
      console.log('Total pages: ' + totalResultCount / itemsPerPageCount);
    }
  });
};
