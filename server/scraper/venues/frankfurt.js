const http = require('http');
const cheerio = require('cheerio');
const _ = require('lodash');

// This part is highly individualized for the respective venues
// TODO: this isn't customized for frankfurt yet, still placeholder!!
let handleResponse = (responseString, resolve) => {
  let res = [];

  let parsed = cheerio.load(responseString);


  let year = new Date().getFullYear();

  let month = _.padStart((1 + new Date().getMonth()), 2, '0');

  parsed('.main-innen.col-sm-12').find('.repertoire-element.clearfix').each((index, el) => {
    let rawDate = parsed(el).find('.col-date').text();

    let date = year + '-' + month + '-' + rawDate.substring(2,4);

    let title = parsed(el).find('h3').text();

    res.push(
      {
        venue: 'frankfurt',
        date: date,
        title: title
      }
    );
  });

  return res;
};

exports.load = new Promise((resolve, reject) => {
  console.log('Calling frankfurt');

  let year = new Date().getFullYear();

  let month = 1 + new Date().getMonth();

  console.log('month', _.padStart(month, 2, '0'));

  let options = {
    host: 'www.oper-frankfurt.de',
    path: '/de/spielplan/?datum=' + year + '-' + _.padStart(month, 2, '0') + '&lang=100',
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
