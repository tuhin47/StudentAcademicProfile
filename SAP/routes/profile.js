var express = require('express');
var router = express.Router();
var mongodb=require('mongodb');
var passport= require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');


router.get('/',function(req,res){
  res.render('index');
});

router.get('/data',function(req,res){
  res.render('profiledata');
});
router.get('/editdata',function(req,res){
  res.render('dataedit');
});


// router.get('/result',function(req,res){
//   res.render('resultdatatable');
// });



module.exports = router;
