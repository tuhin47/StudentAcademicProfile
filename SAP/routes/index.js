var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/index2',function(req,res){
  res.render('index2');
});
router.get('/index',function(req,res){
  res.render('index');
});
router.get('/register',function(req,res){
  res.render('register');
});



module.exports = router;
