var express = require('express');
var router = express.Router();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var url = require('url');
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var bcrypt = require('bcryptjs');
var PDFDocument = require('pdfkit');
var fs = require('fs');

// var xoauth2 = require('xoauth2');
// var nodemailersmtptransport=require('nodemailer-smtp-transport');
//var sleep=require('sleep');

mongoose.connect('mongodb://localhost/NodeDemo');
var db = mongoose.connection;



var User = require('../models/user');
var Profile = require('../models/profilemodel');
var Award = require('../models/award');
var Graduation = require('../models/graduation');
var Hobby = require('../models/hobby');
var interest = require('../models/interest');
var Project = require('../models/project');
var Publication = require('../models/publication');
var SSCResult = require('../models/sschscresult');

var Profiles=[];
var Awards=[];
var Garduations=[];
var Projects=[];
var Publications=[];
var SSCResults=[];






/* GET users listing. */
router.get('/', function(req, res, next) {
  var fullname = req.user.firstname + ' ' + req.user.lastname;




  res.render('generatecv', {
    fullname: fullname
  });
});
router.post('/', function(req, res, next) {
  var query1={username:req.user.username};
  console.log('inside post generatecvs');
  Profile.find(query1,function(err1,profile){
    if(err1) throw err1;
    else {

      Award.find(query1,function(err2,award){
          if(err2) throw err2;
          else {
            
          }

      });

    }
  });
  //console.log(Profiles);





  var fullname = req.user.firstname + ' ' + req.user.lastname;
  console.log('before pipe');
  var doc = new PDFDocument();
  var filepath = req.body.filepath;
  var path = filepath + '';
  var l = path.length;

  if (path[l - 1] != '/') path = filepath + '/';

  doc.pipe(fs.createWriteStream(path + '' + fullname + '.pdf'));

  doc.font('Times-Roman')
    .fontSize(25)
    .text('' + fullname, 300, 10);

  doc.moveTo(0, 100)
    .lineTo(200, 100)
    .stroke();


  // console.log('after pipe');
  // doc.font('fonts/PalatinoBold.ttf')
  //    .fontSize(25)
  //    .text('Some text with an embedded font!', 100, 100);
  //
  // console.log('before addPage');
  // doc.addPage()
  //    .fontSize(25)
  //    .text('Here is some vector graphics...', 100, 100);
  // console.log('after addPage');
  //
  // doc.save()
  //    .moveTo(100, 150)
  //    .lineTo(100, 250)
  //    .lineTo(200, 250)
  //    .fill("#FF3300");
  //
  //
  // doc.scale(0.6)
  //    .translate(470, -380)
  //    .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
  //    .fill('red', 'even-odd')
  //    .restore();


  doc.end();

  console.log('----------->   pdf created');
  res.redirect('/profile');

});



module.exports = router;
