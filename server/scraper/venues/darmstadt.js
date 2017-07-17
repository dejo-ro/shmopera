// Use httpS here!
const https = require('https');
const cheerio = require('cheerio');
const _ = require('lodash');

const MONTHNAME_TO_NUMBER = {
  'Januar': 1,
  'Februar': 2,
  'März': 3,
  'April': 4,
  'Mai': 5,
  'Juni': 6,
  'Juli': 7,
  'August': 8,
  'September': 9,
  'Oktober': 10,
  'November': 11,
  'Dezember': 12
};

// This part is highly individualized for the respective venues
let handleResponse = (responseString, resolve) => {
  let res = [];

  let parsed = cheerio.load(responseString);

  let monthName = parsed('#eventList').find('h3').text().split(' ')[0];

  parsed('#eventList').find('li.additionalInfo').each((index, el) => {
    let dayNumber = parsed(el).find('.dateWrapper').find('p span').text();

    let title = parsed(el).find('h4').text();

    let date = new Date().getFullYear() + '-' + MONTHNAME_TO_NUMBER[monthName] + '-' + dayNumber;

    res.push(
      {
        venue: 'darmstadt',
        date: date,
        title: title
      }
    );

  })

  return res;
};

exports.load = () => {

  return new Promise((resolve, reject) => {
    console.log('Calling darmstadt');
    var options = {
      host: 'www.staatstheater-darmstadt.de',
      path: '/spielplan-tickets/spielplan/alles.html?no_cache=1&tx_sfspielplan_pi2[channel]=1&tx_sfspielplan_pi2[month]=&tx_sfspielplan_pi2[aenderungen]=&tx_sfspielplan_pi2[premiere]=&tx_sfspielplan_pi2[archiv]=0&tx_sfspielplan_pi2[pageid]=',
      port: '443',
      method: 'GET'
    };

    callback = function(response) {
      var str = ''
      response.on('data', function (chunk) {
        str += chunk;
      });

      response.on('end', function () {
        console.log('Received darmstadt');
        let handled = handleResponse(str);
        resolve(handled);
      });
    }

    var req = https.request(options, callback);
    req.end();
  });
}
