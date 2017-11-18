var express = require('express');
var router = express.Router();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session= require('express-session');
var expressValidator=require('express-validator');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var passport =require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose= require('mongoose');
var url=require('url');
var nodemailer = require('nodemailer');
var async = require('async');
var crypto=require('crypto');
var bcrypt = require('bcryptjs');
// var xoauth2 = require('xoauth2');
// var nodemailersmtptransport=require('nodemailer-smtp-transport');
//var sleep=require('sleep');

mongoose.connect('mongodb://localhost/NodeDemo');
var db = mongoose.connection;



var User = require('../models/user');
var Profile = require('../models/profilemodel');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var fullname=req.user.firstname+' '+req.user.lastname;
  res.render('generatecv',{fullname:fullname});
});



module.exports = router;
