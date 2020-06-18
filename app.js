var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var bodyParser = require('body-parser')
var compression = require('compression')
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var flash = require('connect-flash');
var bcrypt = require('bcrypt');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var usersRouter = require('./routes/users');
var videopageRouter = require('./routes/videopage');
var userpage = require('./routes/userpage')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression())

var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'ggthegame2',
  database : 'hotube'
});
db.connect();


app.use(session({
  secret: 'asadlfkj!@#!@#dfgasdg',
  resave: false,
  saveUninitialized: true,
  store:new FileStore()
}))
app.use(flash())

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  console.log("1123")
  db.query(`SELECT ID FROM users WHERE email=?`,[user.email],function(err, result){
    console.log(result)
    done(null, result[0])
  })
});

passport.deserializeUser(function(id, done) {
  console.log("d",id.ID)
  db.query(`SELECT * FROM users WHERE ID='${id.ID}'`,function(err, result){
    console.log("f",result)
    done(null, result[0])
  })
  
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    function(username, password, done) {
      console.log(username, password )
      db.query(`SELECT * FROM users WHERE email=?`,[username],function(err,result){
        console.log("h",result)
        if(result[0]){
          if(username === result[0].email){
            bcrypt.compare(password,result[0].password, function(err,result2){
              if(result2){
                return done(null, result[0]);
              }else{
                return done(null, false, { message: 'Incorrect password.' });
              }
            })
          }else{
            return done(null, false, { message: 'Incorrect username.' });
          }
        }else{
          return done(null, false, { message: 'Incorrect username.' });
        }
      })
    }
  ));

  app.post('/login/login_process',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);  





app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/videopage', videopageRouter);
app.use('/userpage', userpage);
app.use('/users', express.static('uploads'));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
