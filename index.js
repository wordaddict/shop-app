const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const pug = require('pug');
const flash = require('connect-flash');
const passport = require('passport');
const yelp = require('yelp');
const yelpFusion = require('yelp-fusion');

var setUpPassport = require('./setuppassport');

var app = express();
const {mongoose}= require('./db/mongoose');
const {User} = require('./models/user.js');


setUpPassport();

app.set("port", process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(session({
  secret: "TJBJHDH984H=hfvnv873yhfh",
  resave: true,
  saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

var user = require("./models/user");
var router = require('./router.js');

// Routes to be transfered to a routes file later
app.use(router);



//Ending of route to be transfered to route file later

var port = 3000;
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
