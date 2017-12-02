var express = require('express');
var router = express.Router();
//var mongodb = require('mongodb');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var User = require('../models/user');
var Awards = require('../models/award');
var awards = require('../controllers/award_controllers');
var Profile = require('../models/profilemodel');

router.get('/', function(req, res) {
  //var fullname = req.user.firstname + ' ' + req.user.lastname;
  Profile.find({}, function(err, results) {
    if (err) throw err;
    if (!results) res.send('No result found');
    else {
      res.render('search', {
        fullname : 'unknown',
        photo : 'dist/img/avatar.jpg',
        results
      });

    }

  });

});

router.get('/searchresult/:id', function(req, res) {
  var id = req.params.id;
  console.log(id);
  // use this id to fetch username then find all data

  if (id.length != 24) res.send("Invalid User");
  else
    Profile.findOne({
      _id: id
    }, function(err, user) {
      if (err) throw err;
      var profilename;
      var university;
      var registration;
      var dept;
      var dob;
      var father;
      var mother;
      var gender;
      var maritalstatus;
      var permanentaddress;
      var temporaryaddress;
      var primaryoccupation;
      var secondaryoccupation;
      var phonenumber;
      var email;
      var language;
      var workexperience;
      var overview;
      var photo;
      if (user) {
        profilename = user.profilename;
        university = user.university;
        registration = user.registration;
        dept = user.dept;
        dob = user.dob;
        father = user.father;
        mother = user.mother;
        gender = user.gender;
        maritalstatus = user.maritalstatus;
        permanentaddress = user.permanentaddress;
        temporaryaddress = user.temporaryaddress;
        primaryoccupation = user.primaryoccupation;
        secondaryoccupation = user.secondaryoccupation;
        phonenumber = user.phonenumber;
        email = user.email;
        language = user.language;
        workexperience = user.workexperience;
        overview = user.overview;
        photo = user.photo;


      }
      if (!user) {
        profilename = null;
        university = null;
        registration = null;
        dept = null;
        dob = null;
        father = null;
        mother = null;
        gender = null;
        maritalstatus = null;
        permanentaddress = null;
        temporaryaddress = null;
        primaryoccupation = null;
        secondaryoccupation = null;
        phonenumber = null;
        email = null;
        language = null;
        workexperience = null;
        overview = null;
        photo = 'dist/img/avatar.jpg';
      }


      if (!user) res.send("Invalid User");
      else
        res.render('demoprofile', {
          profilename: profilename,
          university: university,
          registration: registration,
          dept: dept,
          dob: dob,
          father: father,
          mother: mother,
          gender: gender,
          maritalstatus: maritalstatus,
          permanentaddress: permanentaddress,
          temporaryaddress: temporaryaddress,
          primaryoccupation: primaryoccupation,
          secondaryoccupation: secondaryoccupation,
          phonenumber: phonenumber,
          email: email,
          language: language,
          workexperience: workexperience,
          overview: overview,
          photo: photo
        });

      console.log('ok output---------------->');

    });
  //res.send('result will be shown here');
});



module.exports = router;
