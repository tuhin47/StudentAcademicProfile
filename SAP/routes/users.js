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
  res.render('register');
});

router.get('/login',function(req,res){
  res.render('login', {
    user: req.user
  });
});

router.get('/signup',function(req,res){
  res.render('signup', {
    user: req.user
  });
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

    res.redirect(url.format({
       pathname:"/profile",
       query: {
          username: username
        }
     }));
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


// from here forget password codes are added. 
// thats why this route goes too much big sorry for this man .

router.get('/forgot', function(req, res) {
  res.render('forgot', {
    user: req.user
  });
});


router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/users/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'SendGrid',
        auth: {
          user: '!!! YOUR SENDGRID USERNAME !!!',
          pass: '!!! YOUR SENDGRID PASSWORD !!!'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'saifarman4@demo.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + 'users/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/users/forgot');
  });
});


router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/users/forgot');
    }
    res.render('reset', {
      user: req.user
    });
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          req.logIn(user, function(err) {
            done(err, user);
          });
        });
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'SendGrid',
        auth: {
          user: '!!! YOUR SENDGRID USERNAME !!!',
          pass: '!!! YOUR SENDGRID PASSWORD !!!'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'saifarman4@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.username+' & '+user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/users/login');
  });
});



module.exports = router;
