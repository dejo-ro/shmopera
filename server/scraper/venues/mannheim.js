const http = require('http');
const cheerio = require('cheerio');
const _ = require('lodash');

// This part is highly individualized for the respective venues
let handleResponse = (responseString, resolve) => {
  let res = [];

  let parsed = cheerio.load(responseString);

  parsed('.filter-wrapper').each((index, el) => {
    rawDate = parsed(el).find('.row').attr('data-date');
    let date = rawDate.substring(0,4) + '-' + rawDate.substring(4,6) + '-' + rawDate.substring(6,8);

    let title = parsed(el).find('span a').text();

    res.push(
      {
        venue: 'mannheim',
        date: date,
        title: title
      }
    );
  });

  return res;
};

exports.load = () => {

  return new Promise((resolve, reject) => {
    console.log('Calling mannheim');

    let currentYear = new Date().getFullYear();
    let currentMonth = 1 + new Date().getMonth();

    let options = {
      host: 'www.nationaltheater-mannheim.de',
      // kat is category. Not sure how the spielplan_content parameter works, is this how they do it in php?!
      path: '/de/spielplan_ajax.php?kat_filter=1&mes=' + currentMonth + '&ano=' + currentYear + '&spielplan_content',
      port: '80',
      method: 'GET'
    };
    
    callback = function(response) {
      var str = ''
      response.on('data', function (chunk) {
        str += chunk;
      });

      response.on('end', function () {
        console.log('Received mannheim');
        let handled = handleResponse(str);

        resolve(handled);
      });
    }

    let req = http.request(options, callback).end();
  });
}
