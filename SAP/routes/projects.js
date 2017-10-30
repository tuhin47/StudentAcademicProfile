var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var User = require('../models/user');
var Projects = require('../models/project');

router.get('/projectsdata', function(req, res) {
  var username = req.user.username;

  console.log('--------------------->>>>  inside projectsdata');


  Projects.find({
    username: username
  }, function(err, results) {
    var fullname = req.user.firstname + ' ' + req.user.lastname;
    if (err) return console.error(err);

    console.log(results);
    console.log('----------------------------->>>>>>>>>> inside results/projectsdata');

    console.log('full name--its here>' + fullname);
    res.render('projectsdata', {
      fullname: fullname,
      results
    });
    console.log('ok huh');
  });


});

router.get('/projectsdataedit', function(req, res) {
  var username = req.user.username;
  var fullname = req.user.firstname + ' ' + req.user.lastname;
  console.log('--------------------->>>>  inside projectsdataedit');
  res.render('projectsdataedit', {
    fullname: fullname
  });
});


router.post('/projectsdataedit', function(req, res) {
  var username = req.user.username;
  var fullname = req.user.firstname + ' ' + req.user.lastname;
  var projecttitle = req.body.projecttitle;
  var projectdetails = req.body.projectdetails;


  var query = {
    'username': username,
    'projecttitle': projecttitle
  };

  Projects.findOneAndUpdate(query, {
    $set: {

      username: username,
      projecttitle: projecttitle,
      projectdetails: projectdetails

    }
  }, {
    new: true,
    upsert: true
  }, function(err, doc) {
    if (err) {
      console.log("Something wrong when updating data!");
    }

  });
  res.redirect('/projects/projectsdata');


});


router.post('/dataedit/:data?', function(req, res) {
  var username = req.user.username;
  var fullname = req.user.firstname + ' ' + req.user.lastname;
  var projecttitle = req.body.projecttitle;
  var projectdetails = req.body.projectdetails


  var query = {
    'username': username,
    'projecttitle': projecttitle
  };

  Projects.findOneAndUpdate(query, {
    $set: {

      username: username,
      projecttitle: projecttitle,
      projectdetails: projectdetails

    }
  }, {
    new: true,
    upsert: true
  }, function(err, doc) {
    if (err) {
      console.log("Something wrong when updating data!");
    }

  });
  res.redirect('/projects/projectsdata');


});



module.exports = router;
