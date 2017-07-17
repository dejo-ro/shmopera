const http = require('http');
const cheerio = require('cheerio');
const _ = require('lodash');

const MONTHNAME_TO_NUMBER = {
  'Januar': '01',
  'Februar': '02',
  'März': '03',
  'April': '04',
  'Mai': '05',
  'Juni': '06',
  'Juli': '07',
  'August': '08',
  'September': '09',
  'Oktober': '10',
  'November': '11',
  'Dezember': '12'
};

// This part is highly individualized for the respective venues
let handleResponse = (responseString, resolve) => {
  let res = [];

  let parsed = cheerio.load(responseString);

  // Each el is one performance
  parsed('.container-central').find('.container-central-spielplan-events').each((index, el) => {
    let date;
    let title;

    // Ugly stuff.
    messyDateString = parsed(el).find('.container-central-spielplan-events-datum').text();
    dayNumber = parsed(el).find('.container-central-spielplan-events-datum').find('h2').text()

    messyMonthName = _.trimStart(messyDateString, dayNumber);
    monthName = messyMonthName.substring(2, messyMonthName.length);

    date = new Date().getFullYear() + '-' + MONTHNAME_TO_NUMBER[monthName] + '-' + dayNumber;

    title = parsed(el).find('.container-central-spielplan-events-right h2').text();

    res.push({
      venue: 'heidelberg',
      date: date,
      title: title
    });
  });

  return res;
};

exports.load = () => {
  // Heidelberg has dynamic page filling; reloads data when scroll reaches bottom, bleh..
  // This is not accounted for here.
  // TODO: account for this!
  return new Promise((resolve, reject) => {
    console.log('Calling heidelberg');
    var options = {
      host: 'www.theaterheidelberg.de',
      path: '/spielplan/?filter=filter_sparte',
      port: '80',
      method: 'POST',
      // Have to set correct content type here!
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": 11
      }
    };

    callback = function(response) {
      var str = ''
      response.on('data', function (chunk) {
        str += chunk;
      });

      response.on('end', function () {
        console.log('Received heidelberg');
        // Resolve only with the final product
        let handled = handleResponse(str);

        resolve(handled);
      });
    }

    var req = http.request(options, callback);
    // This is the data we are posting. It represents Sparte = 'Musiktheater'
    req.write("Filter=1267");
    req.end();
  });
}
