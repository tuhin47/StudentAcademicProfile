var express = require('express');
var router = express.Router();
var mongodb=require('mongodb');
var url =require('url');
var passport= require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/NodeDemo');
var db = mongoose.connection;


var User = require('../models/user');
var Profile = require('../models/profilemodel');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var a=25;
  var b=65;
  var c=a*b;
  console.log('------------------------------>>'+c);

  res.render('register');
});

router.get('/login',function(req,res){




  res.render('login');
});

router.get('/signup',function(req,res){
  res.render('signup');
});

router.post('/signup',function(req,res){

    var firstname = req.body.firstname;
    var lastname= req.body.lastname;
  	var email = req.body.email;
  	var username = req.body.username;
  	var password = req.body.password;
  	var password2 = req.body.password2;

  	// Validation
  	req.checkBody('firstname', 'First Name is required').notEmpty();
    req.checkBody('lastname', 'Last Name is required').notEmpty();
  	req.checkBody('email', 'Email is required').notEmpty();
  	req.checkBody('email', 'Email is not valid').isEmail();
  	req.checkBody('username', 'Username is required').notEmpty();
  	req.checkBody('password', 'Password is required').notEmpty();
  	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
  console.log('------>    '+username+'  ----->     '+email);


  var errors=req.validationErrors();

  if(errors){
    console.log(errors);
		res.render('signup',{
      errors:errors
    });
    console.log('YES ERRORS!!!');
	}else {
    console.log('enter');
    var newUser = new User({
      username: username,
      firstname: firstname,
      lastname: lastname,
			email:email,
			password: password
		});

    User.createUser(newUser,function(err,user){
      if (err) throw err;
      console.log(user);
      console.log('these datas are uploaded');
    });

    req.flash('success_msg','You are register and can now login');

    res.redirect('login');
      console.log('Passed');
  }

  //res.redirect('login');

});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});




router.post('/login',
  passport.authenticate('local', { failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    var username = req.user.username;
    var fullname= req.user.firstname+' '+req.user.lastname;


    //console.log('------------------->>>>'+fullname);
    //console.log('dhuru-------------------------->>>>>>>>'+req.user);
    res.redirect(url.format({
       pathname:"/profile",
       query: {
          username: username
        }
     }));

    //res.redirect('/profile?fullname='+fullname);
  });


router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});



module.exports = router;
