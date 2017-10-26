var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Profile = require('../models/profilemodel');




router.get('/', ensureAuthenticated, function(req, res) {
  console.log('---------------------------------->>>>>>  inside profile');
  var fullname = req.user.firstname + ' ' + req.user.lastname;
  username = req.query.username;
  //console.log('--------------------->>>'+fullname);

  res.render('index', {
    fullname: fullname
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error_msg', 'You are not logged in');
    res.redirect('/users/login');
    //return next();
  }
}

router.get('/data', ensureAuthenticated, function(req, res) {
  var fullname = req.user.firstname + ' ' + req.user.lastname;
  var username = req.user.username;
  var query = {
    'username': username
  };

  Profile.findOne(query, function(err, user) {
    if (err) throw err;
    if (!user) return res.send(401);

    var profilename = user.profilename;
    var registration = user.registration;
    var dept = user.dept;
    var dob = user.dob;
    var father = user.father;
    var mother = user.mother;
    var gender = user.gender;
    var maritalstatus = user.maritalstatus;
    var permanentaddress = user.permanentaddress;
    var temporaryaddress = user.temporaryaddress;
    var primaryoccupation = user.primaryoccupation;
    var secondaryoccupation = user.secondaryoccupation;
    var phonenumber = user.phonenumber;
    var email = user.email;
    var language = user.language;
    var workexperience = user.workexperience;
    var overview = user.overview;

    console.log('---------> in data route--------------------------->>>>>');
    console.log('  ---------profilename->>> ' + profilename + ' --regi- ' + registration + '----dept- ' + dept);
    console.log('  ---------birth->>> ' + dob + ' -father-- ' + father + '--mother--- ' + mother);
    console.log('  --------gender-->>> ' + gender + ' --marital status- ' + maritalstatus + '---permanentaddress-- ' + permanentaddress);
    console.log('  -----temporaryaddress----->>> ' + temporaryaddress + '-primaryoccupation-- ' + primaryoccupation + '--secondaryoccupation--- ' + secondaryoccupation);
    console.log('  --------phonenumber-->>> ' + phonenumber + ' -email-- ' + email + '---language-- ' + language);
    console.log('  ---------workexperience->>> ' + workexperience + ' -overview-- ' + overview + '--dept--- ' + dept);

    res.render('profiledata', {
      fullname: fullname,
      profilename: profilename,
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
      phonenumber: phonenumber,
      email: email,
      language: language,
      workexperience: workexperience,
      overview: overview
    });
  });



  //console.log('userdata---------------------->>>>>>'+userdata);

});

router.get('/editdata', ensureAuthenticated, function(req, res) {
  var fullname = req.user.firstname + ' ' + req.user.lastname;
  res.render('dataedit', {
    fullname: fullname
  });
});


router.post('/editdata', ensureAuthenticated, function(req, res) {
  var username = req.user.username;
  console.log('usename in editdata------------------' + username);
  var profilename = req.body.profilename;
  var registration = req.body.registration;
  var dept = req.body.dept;
  var dob = req.body.dob;
  var father = req.body.father;
  var mother = req.body.mother;
  var gender = req.body.gender;
  var maritalstatus = req.body.maritalstatus;
  var permanentaddress = req.body.permanentaddress;
  var temporaryaddress = req.body.temporaryaddress;
  var primaryoccupation = req.body.primaryoccupation;
  var secondaryoccupation = req.body.secondaryoccupation;
  var phonenumber = req.body.phonenumber;
  var email = req.body.email;
  var language = req.body.language;
  var workexperience = req.body.workexperience;
  var overview = req.body.overview;



  console.log('  ---------profilename->>> ' + profilename + ' --regi- ' + registration + '----dept- ' + dept);
  console.log('  ---------birth->>> ' + dob + ' -father-- ' + father + '--mother--- ' + mother);
  console.log('  --------gender-->>> ' + gender + ' --marital status- ' + maritalstatus + '---permanentaddress-- ' + permanentaddress);
  console.log('  -----temporaryaddress----->>> ' + temporaryaddress + '-primaryoccupation-- ' + primaryoccupation + '--secondaryoccupation--- ' + secondaryoccupation);
  console.log('  --------phonenumber-->>> ' + phonenumber + ' -email-- ' + email + '---language-- ' + language);
  console.log('  ---------workexperience->>> ' + workexperience + ' -overview-- ' + overview + '--dept--- ' + dept);


  console.log('personal data ok');
  var newProfile = new Profile({
    username: username,
    profilename: profilename,
    registration: registration,
    dept: dept,
    dob: dob,
    father: father,
    mother: mother,
    gender: gender,
    maritalstatus: maritalstatus,
    permanentaddress: permanentaddress,
    temporaryaddress: temporaryaddress,
    primaryoccupation: secondaryoccupation,
    phonenumber: phonenumber,
    email: email,
    language: language,
    workexperience: workexperience,
    overview: overview

  });

  var query = {
    'username': username
  };
  // Profile.findOneAndUpdate(query,newProfile,function(err,profile){
  //   if (err) throw err;
  //   console.log(profile);
  //   console.log('------------>these datas are uploaded');
  // });
  Profile.findOneAndUpdate(query, {
    $set: {

      username: username,
      profilename: profilename,
      registration: registration,
      dept: dept,
      dob: dob,
      father: father,
      mother: mother,
      gender: gender,
      maritalstatus: maritalstatus,
      permanentaddress: permanentaddress,
      temporaryaddress: temporaryaddress,
      primaryoccupation: secondaryoccupation,
      phonenumber: phonenumber,
      email: email,
      language: language,
      workexperience: workexperience,
      overview: overview
    }
  }, {
    new: true,
    upsert: true
  }, function(err, doc) {
    if (err) {
      console.log("Something wrong when updating data!");
    }

    console.log(doc);
  });

  req.flash('success_msg', 'You are register and can now login');

  res.redirect('/profile/data');

});


// router.get('/result',function(req,res){
//   res.render('resultdatatable');
// });



module.exports = router;
