var express = require('express');
var router = express.Router();
var mongodb=require('mongodb');

var User = require('../models/user');


/* GET users listing. */
router.get('/', function(req, res, next) {
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
  	var password = req.body.pwd;
  	var password2 = req.body.pwd2;

  	// Validation
  	req.checkBody('firstname', 'First Name is required').notEmpty();
    req.checkBody('lastname', 'Last Name is required').notEmpty();
  	req.checkBody('email', 'Email is required').notEmpty();
  	req.checkBody('email', 'Email is not valid').isEmail();
  	req.checkBody('username', 'Username is required').notEmpty();
  	req.checkBody('pwd', 'Password is required').notEmpty();
  	req.checkBody('pwd2', 'Passwords do not match').equals(req.body.pwd);
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



    // var MongoClient = mongodb.MongoClient;
    //
    //
    //     var url = 'mongodb://localhost:27017/NodeDemo';
    //
    //
    //     MongoClient.connect(url, function(err, db){
    //       if (err) {
    //         console.log('Unable to connect to the Server:', err);
    //       } else {
    //         console.log('Connected to Server');
    //
    //
    //         var collection = db.collection('users');
    //
    //
    //         var user1 = {firstname:firstname , lastname:lastname, username:username,
    //            email: email, password:password};
    //
    //         // Insert the student data into the database
    //         collection.insert([user1], function (err, result){
    //           console.log('inside insert data');
    //           if (err) {
    //             console.log(err);
    //           } else {
    //
    //             // Redirect to the updated student list
    //             res.redirect('login');
    //           }
    //
    //           // Close the database
    //           db.close();
    //         });
    //
    //       }
    //     });

      console.log('Passed');
  }

  //res.redirect('login');

});


module.exports = router;
