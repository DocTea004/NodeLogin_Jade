var express = require('express');
var router = express.Router();

//Get HomePage
router.get('/',
ensureAuthenticated,
 function(req,res,next){
    res.render('index', {title:'Members'});
});

function ensureAuthenticated(req,re,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/users/login');
}

module.exports = router;