const _ = require('lodash');

// var exports = {};


// let venues = ['darmstadt', 'heidelberg', 'mannheim', 'stuttgart', 'karlsruhe', 'frankfurt'];

let venues = ['karlsruhe'];

let venueData = {};  //

_.forEach(venues, (v) => {
  venueData[v] = {
    name: v,
    loader: require('./venues/' + v + '.js')
  }
});

exports.venueData = venueData;

exports.listVenues = () => {
  _.forEach(venues, (v) => {
    console.log(v);
  })
}



// module.exports = exports;
