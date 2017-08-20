const express = require('express');
const passport = require('passport');
const path = require('path');
const request = require('request');

const yelp = require('yelp-fusion');

const clientId = 'W5U9fL2Ce5ad9bEC5ewqLQ';
const clientSecret = 'x4dDdLLCTyfeD2d1rwABXQdUpwfkMHyKIrjfATed0aEmW473cZad9ayRM49no2XV';

var User = require('./models/user');

var app = express();
app.use(passport.initialize());
app.use(passport.session());
var router = express.Router();

app.use(express.static(path.join(__dirname, 'public')));

router.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.infos = req.flash('info');
  next();
});

router.get('/', function(req, res, next){
  console.log("YOU ARE HOME FROM ROUTER")
  User.find()
  .sort({
    createdAt: "descending"
  })
  .exec(function (err, users) {
    if (err) {
      return next(err);
    }
    res.render('index.pug', {
      users: users
    });
  });
});

router.get('/signup', (req, res) => {
  res.render('signup.pug');
});

router.post("/signup", (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({
    email: email
  }, function(err, user) {
    if(err) {
      return next(err);
    }if (user) {
      console.log("USER ALREADY EXISTS", user.email)
      req.flash('error', 'User already exists');
      return res.redirect("/login");
    }

    var newUser = new User({
      email: email,
      password: password
      });
      newUser.save(next);
      console.log("SAVED NEW USER", newUser)
      res.redirect("/login")
  });
});

router.post("/login", (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({
    email: email
  }, function(err, user) {
    if(err) {
      return next(err);
    }if (user) {
      console.log("USER LOGIN SUCCESSFUL", user)
      req.flash('success', 'You have successfully logged in');
      return res.redirect("/");
    }
  })
  }, passport.authenticate('login', {
    sucessRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true
  }
));


router.get('/login', (req, res) => {
  res.render('login.pug');
});


router.post('/search', (req, res) => {
  request.get('https://api.yelp.com/v3/businesses/search', (err, response, body) => {
    if(!err && response.statusCode === 200) {
      var locals = JSON.parse(body);
      res.send('index', locals)
    }
    const searchRequest = {
      term: req.body.term,
      location:req.body.location
    };

    yelp.accessToken(clientId, clientSecret).then(response => {
      const client = yelp.client(response.jsonBody.access_token);

      client.search(searchRequest).then(response => {
        const firstResult = response.jsonBody.businesses[0, 1, 2, 3];
        const prettyJson = JSON.stringify(firstResult, null, 4);
        res.send(prettyJson);
      });
    }).catch(e => {
      console.log(e);
    })
  })
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
  next();
  } else {
  req.flash("info", "You must be logged in to see this page.");
  res.redirect("/login");
    }
};

router.use(function(err, req, res, next) {
  res.status(500);
  console.log("ERROR", err)
  res.send("Internal server error.");
});


module.exports = router
