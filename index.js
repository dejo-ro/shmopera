var express = require('express')
const _ = require('lodash');

var app = express()

const scraper = require('./server/scraper');

// scraper.venueData.frankfurt.loader.load.then((res) => {
//   console.log('res');
//   console.log(res);
// });

let promises = _.map(scraper.venueData, (el) => {
  return el.loader.load();
})

let allEvents;

Promise.all(promises)
.then((results) => {
  allEvents = _.chain(results)
    .flatten()
    .filter((el) => {
      // Does this have a date property?
      return el!==undefined && el.hasOwnProperty('date');
    })
    .forEach((e) => {
        e.date = new Date(e.date);
    })
    .orderBy('date')
    .value();

  console.log(allEvents);
})
.catch((e) => {
  console.log('Promise failed: ', e);
});


// TODO: This part for handling requests
// app.get('*', function(req, res) {
//   res.json({notes: "This is your notebook. Edit this to start saving your notes!"})
// })
//
// app.listen(3000)
