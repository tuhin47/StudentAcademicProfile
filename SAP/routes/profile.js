var express = require('express');
var router = express.Router();
var mongodb=require('mongodb');
var passport= require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');


router.get('/',function(req,res){
  res.render('index');
});
router.get('/index',function(req,res){
  res.render('index2');
});
router.get('/other',function(req,res){
  res.render('index');
});


// router.get('/result',function(req,res){
//   res.render('resultdatatable');
// });





module.exports = router;
