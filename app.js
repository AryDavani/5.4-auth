const express = require('express');
const path = require('path');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const session = require('express-session');
const parseurl = require('parseurl');

const app = express();

// users
const users = [
  { username: 'ary', password: 'asdf', name: "Ary"},
  { username: 'faith', password: '1234', name: "Faith"}
];


// view engine
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', 'views');

// app.use
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'top secret',
  resave: false,
  saveUninitialized: true
}));

app.use(function(req, res, next) {
  var pathname = parseurl(req).pathname;
  console.log(pathname);

  if(!req.session.user && pathname != '/login'){
    res.redirect('/login');
  } else{
    next();
  }
})


// app.use(function(req, res, next) {
//   var views = req.session.views;
//
//   if(!views){
//     views = req.session.views = {};
//   }
//
//   var pathname = parseurl(req).pathname;
//   views[pathname] = (views[pathname] || 0) + 1;
//   next();
// });

app.get('/', function(req, res) {
  let display = {
    name: req.session.user.name
  };

  res.render('rootPage', display);
});


app.get('/login', function(req, res) {
  res.render('login', {});
});

// app.post('/login', function(req, res){
//   if(req.body.username === users.username && req.body.password === users.password){
//     res.render('rootPage', {users});
//   } else {
//     res.render('login', {});
//   }
// });

app.post('/login', function(req, res) {
  let username = req.body.username;
  let password = req.body.password;

  let person = users.find(function(user) {
    return user.username === username;
  });

  if(person && person.password == password){
    req.session.user = person;
  }

  if(req.session.user){
  res.redirect('/');
  } else {
  res.redirect('/login');
  }
  
});


app.listen(3000);
