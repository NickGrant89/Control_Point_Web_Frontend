//Using modual

const morgan = require('morgan'); // Console Logger
const Joi = require('joi');  // Joi is a validator, making code smaller//
const express = require('express'); // Express Framework
const path = require('path');
const bodyParser = require('body-parser')
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database')
const passport = require('passport');

// This calls the Device model to intergate the DBnjkn

const ensureAuthenticated = require('../onecEnterprise/middleware/login-auth')

let DataSet = require('./models/dataset');

let User = require('./models/user');

// Call Moongoose connection
const mongoose = require('mongoose');
mongoose.connect(config.database,{ useNewUrlParser: true });

// Starting DB connection

let db = mongoose.connection;

db.once('open', function(){
    console.log('MongoDB Live');

})

db.on('error', function(err){
    console.log(err);

});

const app = express();
app.use(express.json());

//Logs all requests to the consol.
app.use(morgan('dev'));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Set Public folder

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.static(path.join(__dirname, 'sbadmin')))

//Express session Middleware

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));

  //Express message middleware

  app.use(require('connect-flash')());
  app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Passport Config
require('./config/passport')(passport);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
})


//GET display SB Admin page

app.get('/', ensureAuthenticated, function(req, res){
    DataSet.find({}, function(err, dataset){
        console.log(dataset);
    res.render('index', {
        title:'Dashboard',
        dataset:dataset,
        
    });
});
});

// Route File

let users = require('./routes/users');
let jwt = require('./routes/apiJWT');
let apiControlPoint = require('./routes/apiControlPoint');
let controlpoint = require('./routes/controlpoint');

app.use('/users', users);
app.use('/api/v1/controlpoint/', apiControlPoint);
app.use('/api/v1/auth/', jwt);
app.use('/controlpoint', controlpoint);


app.get('*', function(req, res) {
    res.status(404).end();
    res.redirect('/');
  });

const port = process.env.Port || 3000;

app.listen(port, '192.168.178.23', () => console.log('Example app listening on port' + ' ' + port +  '!'))
