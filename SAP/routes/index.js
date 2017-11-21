var express = require('express');
var router = express.Router();


router.get('/',function(req,res){
    res.render('startpage');
});

//Demo Routes Using for test


router.get('/line',function(req,res){
    res.render('linechart');
});




module.exports = router;
