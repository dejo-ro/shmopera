const https = require('https');
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
  console.log('Calling stuttgart');
  let options = {
    host: 'www.staatstheater-stuttgart.de',
    // kat is category. Not sure how the spielplan_content parameter works, is this how they do it in php?!
    path: '/spielplan/filter/oper/',
    port: '443',
    method: 'GET'
  };

  callback = function(response) {
    var str = ''
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      console.log('Received stuttgart');
      let handled = handleResponse(str);

      resolve(handled);
    });
  }

  let req = https.request(options, callback).end();
});
