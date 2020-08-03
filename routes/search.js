
var express = require('express');
var router = express.Router();
//var mongodb = require('mongodb');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var User = require('../models/user');
var Awards = require('../models/award');
var awards = require('../controllers/award_controllers');
var Profiles = require('../models/profilemodel');

router.get('/',function (req,res) {
  Profiles.find({},function(err,results) {
    if (err) throw err;
    if(!results) res.send('No result found');
    else {

      res.render('search',{results:results});
    }

  });

});




module.exports = router;
