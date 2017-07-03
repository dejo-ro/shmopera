var express = require('express')

var app = express()

const scraper = require('./server/scraper');

scraper.venueData.darmstadt.loader.load.then((res) => {
  console.log('res');
  console.log(res);
});


app.get('*', function(req, res) {
  // scraper.listVenues();

  // scraper.venueData.heidelberg.loader.run();

// console.log(scraper.venueData);


  res.json({notes: "This is your notebook. Edit this to start saving your notes!"})
})

app.listen(3000)
