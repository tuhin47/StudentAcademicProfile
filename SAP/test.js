var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/NodeDemo');
var Graduations = require('./models/graduation');
var Sync = require('sync');


function asyncFunction(callback) {
    process.nextTick(function(){
      username = '1';

      var data = [];
      Graduations.find({
        username: username
      }, function(err, results) {

        if (err) throw err;

        else if (results) {
         // console.log(results);

          for (var i = 0; i < results.length; i++) {
            if (parseFloat(results[i].gradepoint) > 0.0) {
              data.push({
                x: results[i].coursecode,
                y: parseFloat(results[i].gradepoint)
              });
            } else {
              drop = +parseFloat(results[i].gradepoint);
            }
          }
        }
          //console.log(data);


          return callback(null,data);
      });
      //console.log(data);


    });
}

Sync(function(){
  var result=asyncFunction.sync(null);
  console.log(result);
});


// var data=[];
// var data=calculateData("abc");
// console.log(data);
