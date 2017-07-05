const http = require('http');
const cheerio = require('cheerio');
const _ = require('lodash');

// This part is highly individualized for the respective venues
let handleResponse = (responseString, resolve) => {
  let res = [];

  let parsed = cheerio.load(responseString);

  parsed('.tag').each((index, el) => {
    let rawDate = parsed(el).find('.datum').attr('id');
    let date = rawDate.split('_').join('-');

    let title = parsed(el).find('.nn').text();

    res.push(
      {
        venue: 'stuttgart',
        date: date,
        title: title
      }
    );
  });

  return res;
};

exports.load = new Promise((resolve, reject) => {
  console.log('Calling frankfurt');
  let options = {
    host: 'www.oper-frankfurt.de',
    path: '/de/spielplan/',
    port: '80',
    method: 'GET'
  };

  callback = function(response) {
    var str = ''
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      console.log('Received frankfurt');
      let handled = handleResponse(str);

      resolve(handled);
    });
  }

  let req = http.request(options, callback).end();
});
