var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer= require('multer');
var upload = multer({dest : './uploads'});
var flash = require('connect-flash');
var mongo= require('mongodb');
var mongoose = require('mongoose');
var db = mongoose.connection; 
var expressValidator = require('express-validator');
var bcrypt = require('bcrypt');
var morgan = require('morgan');

var routes= require('./routes/index');
var users = require('./routes/user');

var app = express();
app.use(morgan('dev'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser);
app.use(express.static(path.join(__dirname,'public')));

//Handle Sessions
app.use(session({
    secret:'secret',
    saveUninitialized:true,
    resave:true
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Validator
app.use(expressValidator({
    errorFormatter:function(param,msg,value){
        var namespace = param.split('.')
        ,root = namespace.shift()
        ,formParam = root;

        while(namespace.length){
            formParam += '[' +namespace.shift() + ']';
        }
        return{
            param:formParam,
            msg:msg,
            value:value
        }

    }
}));

app.use(require('connect-flash')());
app.use(function(req,res,next){
    res.locals.messages = require('express-messages')(req,res);
    next();
});

app.get('/', function(req,res,next){
    res.locals.user = req.useer || null;
    next();
});

app.use('/', routes);
app.use('/users', users);

//catch 404 and forward handler 
/*
app.use(function(req,res,next){
    var err = new Error('Not Found');
    err.status = 404;
    next(error);
});


if(app.get('env')=== 'development'){
    app.use(function(err,req,res,next){
        res.status(err.status || 5000);
        res.render('error', {
            message: err.message,
            error:err
        });
    });
}


app.use(function(err,req,res,next){
    res.status(err.status || 5000);
    res.render('error', {
        message:err.message,
        error:err

    });
});

*/
app.listen(3000);