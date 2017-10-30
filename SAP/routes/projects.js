var express = require('express');
var router = express.Router();
var mongodb=require('mongodb');
var passport= require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var User = require('../models/user');
var SSCResult = require('../models/sschscresult');

router.get('/projectsdata',function(req,res){
  var username=req.user.username;
  var fullname=req.user.firstname+' '+req.user.lastname;
  console.log('--------------------->>>>  inside projectsdata');
  console.log('-------------->> '+fullname);


  res.render('projectsdata',{fullname:fullname});
});

router.get('/projectsdataedit',function(req,res){
  var username=req.user.username;
  var fullname=req.user.firstname+' '+req.user.lastname;
  console.log('--------------------->>>>  inside projectsdataedit');
  res.render('projectsdataedit',{fullname:fullname});
});



module.exports=router;
