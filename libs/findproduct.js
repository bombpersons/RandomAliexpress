var require = patchRequire(require);

// Get's a random product from a page of items.
exports.findproduct = function(search, currency, lowbudget, highbudget, maxRetries) {
  var totalResultCount = 0;
  var itemsPerPageCount = 0;
  var totalPages = 0;

  var randomNum = 0;
  var randomPage = 0;

  var casper = require('casper').create();
  casper.on('remote.message', function(msg) {
    console.log('remote: ' + msg);
  });


  casper.start('http://aliexpress.com/af/' + search + '.html');

  // Narrow the search to match our budget.
  casper.then(function() {
    console.log('Searching for "' + search + '" with prices between ' + lowbudget + currency + ' and ' + highbudget + currency + '.');
    if (!this.exists('form#narrow-form')) {
      console.log("No results!");
      this.die();
    }

    this.fill('form#narrow-form', {
      'SearchText': search,
      'minPrice': lowbudget,
      'maxPrice': highbudget
    }, true);

  });

  // Make sure the results are in the right currency.
  casper.then(function() {
    console.log('Clicking ' + currency + ' button.');
    this.click('a[data-currency="' + currency + '"]');
    this.wait(1000);

    console.log('Clicking gallery view button.');
    this.click('a[title="Gallery"]');
    this.wait(1000);
  });

  // Pick one something at random.
  casper.then(function() {
    console.log('Getting total page count...');

    // Get the total amount of items.
    totalResultCount = this.evaluate(function () {
      var countTag = document.getElementsByClassName('search-count');
      return countTag[0].innerHTML;
    });

    // Get rid of commas
    totalResultCount = totalResultCount.replace(',', '');

    // Get how many items there are per page.
    itemsPerPageCount = this.evaluate(function() {
      var resultListTags = document.getElementsByClassName('product');
      return resultListTags.length;
    });

    // We can calculate how many pages there are.
    totalPages = totalResultCount / itemsPerPageCount;

    console.log('Total Items: ' + totalResultCount);
    console.log('Items per page: ' + itemsPerPageCount);
    console.log('Total Pages: ' + totalPages);

    // Seems the maximum page that you can view is 243...
    // Not sure why...
    var maxPage = 243;
    if (totalPages > maxPage)
      totalPages = maxPage;
  });

  // Pick an item on the page.
  casper.then(function() {
    function pickItem() {
      var itemTags = document.getElementsByClassName('list-item');
      var randomNum = Math.floor(Math.random() * itemTags.length);

      //console.log('randomNum: ' + randomNum);
      var itemTag = itemTags[randomNum];

      // Get the price
      var priceTag = itemTag.getElementsByClassName('price')[0];
      //console.log('priceTag: ' + priceTag.innerHTML);

      var price = priceTag.getElementsByClassName('value')[0].innerHTML;
      price = price.replace(/[^1234567890.-]+/g, '');

      // The price can be in the form of 10.00-15.00
      // Just take the bigger one.
      // TODO make this work if there is a price within our budget.
      var prices = price.split('-');
      if (prices.length == 2) {
        price = prices[1];
      }
      price = Number(price);

      //console.log('price: ' + price);

      // Shipping price if there is one.
      var shipping = 0;
      var shippingTag = itemTag.getElementsByClassName('pnl-shipping')[0];
      if (shippingTag) {
        //console.log('shippingTag: ' + shippingTag.innerHTML);

        shipping = shippingTag.getElementsByClassName('value')[0].innerHTML;
        shipping = Number(shipping.replace(/[^1234567890.]+/g, ''));

        //console.log('shipping: ' + shipping);
      }

      // The URL
      var urlTag = itemTag.getElementsByClassName('product')[0];
      var url = urlTag.getAttribute('href');
      var name = urlTag.innerHTML;

      //console.log('url: ' + url);

      return {
        'name': name,
        'URL': url,
        'price': price + shipping
      };
    }

    var pickedItem = null;

    // If there are any results..
    if (totalResultCount > 0) {

      var retries = 0;
      while (true) {
        console.log('Item selection attempt ' + retries);

        // Generate a random page that is in range.
        if (totalPages > 1) {
          randomPage = Math.floor(Math.random() * totalPages);
          console.log('Going to page ' + randomPage);
          this.sendKeys('input#pagination-bottom-input', randomPage.toString(), {reset: true});
          this.click('input#pagination-bottom-goto');

          this.capture('output/pagecapture-' + search + '-' + randomPage + '.png');
          console.log("waited.");
        }

        var item = this.evaluate(pickItem);

        if (item.price >= lowbudget && item.price <= highbudget) {
          pickedItem = item
          console.log("Found item!");
          break;
        } else {
          console.log('Rejected: ' + item.URL + ' at total price of  ' + item.price);
          ++retries;
          if(retries > maxRetries)
          {
            console.log("Hit max retries (" + maxRetries + ")");
            break;
          }
        }
      }
    }

    if(pickedItem)
    {
      console.log('Picked: ' + pickedItem.name + ' at total price of ' + pickedItem.price);
      console.log(pickedItem.name);
    }
    else
    {
      // No results.
      console.log("Couldn't find anything!");
    }

    });


  casper.run();
};
