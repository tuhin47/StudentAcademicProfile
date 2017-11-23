var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/NodeDemo');
var Graduations = require('../models/graduation');
var Sync = require('sync');
var sync = require('synchronize');
function calculateData(username) {
  var username = 'tuhin47';
  var data = [];
  Graduations.find({
    username: username
  }, function(err, results) {

    if (err) throw err;

    else if (results) {

      for (var i = 0; i < results.length; i++) {
        if (parseFloat(results[i].gradepoint) > 0.0) {
          data.push({
            x: results[i].coursecode,
            y: parseFloat(results[i].gradepoint)
          })
        } else {
          drop = +parseFloat(results[i].gradepoint);
        }
      }
    }
    mongoose.connection.close();
    //console.log(data);
    return data;
  });
}

//
 var data = calculateData('tuhin47');
 console.log(data);
