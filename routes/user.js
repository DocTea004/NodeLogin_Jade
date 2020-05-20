var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads'});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/users');

//Get Users listing
router.get('/', function(req,res,next){
    res.send('respond with a resource');
});

router.get('/register', function(req,res,next){
    res.render('register',{title:'Register'});
});

router.get('/login',function(req,res,next){
    res.render('login',{title:'Login'});
});

router.post('/login',
passport.authenticate('local',{failureRedirect:'/users/login', failureFlash: 'Invalid username or password'})
,function(req,res,next){
    req.flash('success', 'You are now logged in');    
    res.redirect('/');
});

passport.serializeUser(function(user,done){
    done(null, user.id);
});

passport.deserializeUser(function(id,done){
    User.getUserByUserId(id,function(err,user){
        done(err,user);
    });
});

passport.use(new LocalStrategy(function(username,password,done){
    User.getUserByUsername(username, function(err,user){
        if(err) throw err;
        if(!user){
            return done(null, false,{message: 'Unknown User'});

        }

        User.comparePassword(password, user.password,function(error, isMatch){
            if(error) return done(error);
            if(isMatch){
                return done(null, user);

            }
            else{
                return done(null, false, {message:'Invalid Password'});
            }
        })
    })

}))

router.post('/register',upload.single('profileimage'),function(req,res,next){
    var name= req.body.name;
    var name = req.body.username;
    var email= req.body.email;
    var password= req.body.password;
    var password= req.body.password2;
    
    if(req.file){
        console.log('uploading file............');
        var profileimage= req.file.filename;
    }
    else
    {
        console.log('No file uploaded ...........');
        var profileimage= 'noimage.jpg'
    }

    //Express Validator
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email not valid').isEmail();
    req.checkBody('usernamename', 'Username field is required').notEmpty();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);


    //Check Errors
    var errors = req.validationErrors();

    if(errors){
        res.render('register', {
            errors:erros
        });
    }
    else{
        
        var newUser = new User({
            name:name,
            email:email,
            username:username,
            password:password,
            password2:password2,
            profileimage:profileimage
        });

        User.createUser(newUser, function(){

        if(err) throw err;
        console.log(user);
        });

        req.flash('success','You are now Registered and can login');

        res.location('/');
        res.redirect('/');
    }
});

router.get('/logout',function(req,res){
    req.logout();
    req.flash("Success", "You are now logged out");
    res.redirect('/users/login');
});

module.exports = router;