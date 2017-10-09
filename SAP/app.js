var express = require('express');
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
mongoose.connect('mongodb://localhost/NodeDemo');
var db = mongoose.connection;


var index = require('./routes/index');
var users = require('./routes/users');
var profile = require('./routes/profile');


var app = express();


app.set('views', [path.join(__dirname, 'views'),
                 path.join(__dirname, 'views/register'),
                 path.join(__dirname, 'views/startpage'),
                 path.join(__dirname, 'views/profiledata')

                   ]);


app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/profile', express.static(__dirname + '/public'));

//express session

app.use(session({
  secret:'secret',
  saveUninitialized:true,
  resave:true
}));

// Passport initializer
app.use(passport.initialize());
app.use(passport.session());



// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.'),
      root    = namespace.shift(),
      formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//oh yah this is connect flash

app.use(flash());

// this is our global variables

app.use(function(req,res,next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
next();

});




app.use('/', index);
app.use('/users', users);
app.use('/profile',profile);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

console.log('Connection Ok. with Port 3000');

module.exports = app;
