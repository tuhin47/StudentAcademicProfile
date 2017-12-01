
var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var User = require('../models/user');
var Awards = require('../models/award');
var awards = require('../controllers/award_controllers');
var Profiles = require('../models/profilemodel');

router.get('/',function (req,res) {
  var fullname=req.user.firstname+' '+req.user.lastname;
  Profiles.find({},function(err,results) {
    if (err) throw err;
    if(!results) res.send('No result found');
    else {

      res.render('search',{fullname:fullname,results});
    }

  });

});

router.get('/searchresult/:id',function(req,res){
  var id=req.params.id;
  console.log(id);
  // use this id to fetch username then find all data
  res.send('result will be shown here');
});



module.exports = router;
