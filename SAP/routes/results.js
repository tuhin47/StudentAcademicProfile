var express = require('express');
var router = express.Router();
var mongodb=require('mongodb');
var passport= require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var User = require('../models/user');


router.get('/sscandhsc',function(req,res){
  console.log('----------------------------->>>>>>>>>> inside results/sscandhsc');
  var fullname =req.user.firstname+' '+req.user.lastname;
console.log('full name-->'+fullname);
  res.render('sscandhsc',{fullname:fullname});
});

router.post('/sscandhsc',function(req,res){
  var passingyear=req.body.passingyear;
  console.log('--------------    '+passingyear+'------------------------------->');
  

});


router.get('/sscandhscedit',function(req,res){
  console.log('----------------------------->>>>>>>>>> inside results/sscandhsc');
  var fullname =req.user.firstname+' '+req.user.lastname;
console.log('full name-->'+fullname);
  res.render('sscandhscedit',{fullname:fullname});
});


module.exports = router;
