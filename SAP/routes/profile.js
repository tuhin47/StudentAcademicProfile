var express = require('express');
var router = express.Router();
var mongodb=require('mongodb');
var passport= require('passport');
var LocalStrategy = require('passport-local').Strategy;
mongoose.connect('mongodb://localhost/NodeDemo');
var db = mongoose.connection;


var User = require('../models/user');

var username=null;


router.get('/',ensureAuthenticated,function(req,res){
  console.log('---------------------------------->>>>>>  inside profile');
  var fullname =req.query.fullname;
  username=req.query.username;
  //console.log('--------------------->>>'+fullname);

  res.render('index',{fullname:fullname});
});
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

router.get('/data',ensureAuthenticated,function(req,res){
  var fullname=req.user.firstname+' '+req.user.lastname;
  var username=req.user.username;

  var data=db.profiledata.findOne('username':username);
console.log('data-------------------->>>'+username);

  //console.log('userdata---------------------->>>>>>'+userdata);
  res.render('profiledata',{fullname:fullname});
});

router.get('/editdata',ensureAuthenticated,function(req,res){
  res.render('dataedit');
});


// router.get('/result',function(req,res){
//   res.render('resultdatatable');
// });



module.exports = router;
