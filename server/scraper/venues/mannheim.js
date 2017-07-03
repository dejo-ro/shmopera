const http = require('http');
const cheerio = require('cheerio');
const _ = require('lodash');

// This part is highly individualized for the respective venues
let handleResponse = (responseString, resolve) => {
  let res = [];

  let parsed = cheerio.load(responseString);

  parsed('.filter-wrapper').each((index, el) => {
    // console.log(parsed(el).find('.row').attr('data-date'));
    rawDate = parsed(el).find('.row').attr('data-date');
    let date = rawDate.substring(0,4) + '-' + rawDate.substring(4,6) + '-' + rawDate.substring(6,8);

    // TODO: get title, almost done!
    let title = 'foo';

    // console.log(date);

    // console.log(parsed('.row').attr('data-date'));
    res.push(
      {
        venue: 'mannheim',
        date: date,
        title: title
      }
    );
  });




  // console.log(res);

  // Each el is one performance
  // parsed('.container-central').find('.container-central-spielplan-events').each((index, el) => {
  //   let date;
  //   let title;
  //
  //   // Ugly stuff.
  //   messyDateString = parsed(el).find('.container-central-spielplan-events-datum').text();
  //   dayNumber = parsed(el).find('.container-central-spielplan-events-datum').find('h2').text()
  //
  //   messyMonthName = _.trimStart(messyDateString, dayNumber);
  //   monthName = messyMonthName.substring(2, messyMonthName.length);
  //
  //   date = new Date().getFullYear() + '-' + MONTHAME_TO_NUMBER[monthName] + '-' + dayNumber;
  //
  //   title = parsed(el).find('.container-central-spielplan-events-right h2').text();
  //
  //   res.push({
  //     venue: 'heidelberg',
  //     date: date,
  //     title: title
  //   });
  // });

  return res;

  // return res;
};

exports.load = new Promise((resolve, reject) => {
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
