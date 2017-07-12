const http = require('http');
const cheerio = require('cheerio');
const _ = require('lodash');

const MONTHNUMBER_TO_NAME = {
  0: 'januar',
  1: 'februar',
  2: 'maerz',
  3: 'april',
  4: 'mai',
  5: 'juni',
  6: 'juli',
  7: 'august',
  8: 'september',
  9: 'oktober',
  10: 'november',
  11: 'dezember'
};

// This part is highly individualized for the respective venues
let handleResponse = (responseString, resolve) => {
  let res = [];

  let parsed = cheerio.load(responseString);

  let currentDate= null;

  parsed('#content2').find('.spielplan.contentBox').each((index, el) => {
    let rawDate = parsed(el).find('.spielplan_day').text();

    let uglyDate = (rawDate === '') ? currentDate : rawDate.split(' ')[1];

    // contentBox with dates and without dates live at the same level. If two shows are on the same day,
    // the second one doesn't have a date. Therefore, preserve the previous date.
    currentDate = uglyDate;

    let date = new Date().getFullYear() + '-' + uglyDate.split('.')[1] + '-' + uglyDate.split('.')[0];

    let title = parsed(el).find('b a').text();

    res.push(
      {
        venue: 'karlsruhe',
        date: date,
        title: title
      }
    );
  });

  return res;
};

exports.load = new Promise((resolve, reject) => {
  console.log('Calling karlsruhe');

  let currentMonth = new Date().getMonth()

  let options = {
    host: 'www.staatstheater.karlsruhe.de',
    path: '/spielplan/' + MONTHNUMBER_TO_NAME[currentMonth] + '/?filter=100',
    port: '80',
    method: 'GET'
  };

console.log('/spielplan/' + MONTHNUMBER_TO_NAME[currentMonth] + '/?filter=100');

  callback = function(response) {
    var str = ''
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      console.log('Received karlsruhe');
      let handled = handleResponse(str);

      resolve(handled);
    });
  }

  let req = http.request(options, callback).end();
});
