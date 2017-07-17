const _ = require('lodash');

let venues = ['darmstadt', 'heidelberg', 'mannheim', 'stuttgart', 'karlsruhe', 'frankfurt'];

let venueData = {};  //

_.forEach(venues, (v) => {
  venueData[v] = {
    name: v,
    loader: require('./venues/' + v + '.js')
  }
});

exports.venueData = venueData;
