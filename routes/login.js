var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser')
var compression = require('compression')
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var flash = require('connect-flash');
var bcrypt = require('bcrypt');
var shortid = require('shortid');
var multer  = require('multer')
const upload = multer({
  storage: multer.memoryStorage(),
});

var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'ggthegame2',
  database : 'hotube'
});
db.connect();


router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login', message: req.flash().error });
});

router.get('/logout', (request, response, next) =>
{
    request.logout();
    request.session.save(function(err){
      
        response.redirect(`/`);
    })
})  

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});
router.post('/register_process',upload.single('avatar'), function(request, response, next) {
  var post = request.body;
  db.query(`SELECT email FROM users WHERE email=?`,[post.email],function(err,result){

   if(result[0]){
    if(result[0].email === post.email){
      request.flash('error', 'use another email')
      response.redirect(`/login/register`)
    }else{

      }  
    }else{
      if(post.password1 !== post.password2){
        request.flash('error', 'password must same')
        response.redirect(`/login/register`)
      }else if(post.email === '' || post.password1 === ''||post.password2 === ''|| post.nickname === ''){
        request.flash('error', 'no empathy')
        response.redirect(`/login/register`)
      }else if(post.password1.length < 10)
      {
        request.flash('error', 'password length need over 10')
        response.redirect(`/login/register`)
      }else if(post.email.length < 5){
        request.flash('error', 'email length need over 5')
        response.redirect(`/login/register`)
      }else{
        bcrypt.hash(post.password1, 10, function(err, hash) {
          var user = {
            ID:shortid.generate(),
            email:post.email,
            password:hash,
            nickname:post.nickname
          }
          if(request.file){
            db.query(`INSERT INTO users (ID, email, password, nickname, image) 
            VALUES(?, ?, ?, ?, ?)`,
          [shortid.generate(), post.email, hash, post.nickname, request.file.buffer], 
          
          function(error, result){
              if(error){
                next(error)
                response.redirect(`/login/register`)
              } else{
               request.login(user, function(err){
                 response.redirect(`/`)
               })
              }
        });
          }else{
            db.query(`INSERT INTO users (ID, email, password, nickname) 
            VALUES(?, ?, ?, ?)`,
          [shortid.generate(), post.email, hash, post.nickname], 
          
          function(error, result){1
              if(error){
                next(error)
                response.redirect(`/login/register`)
              } else{
               request.login(user, function(err){
                 response.redirect(`/`)
               })
              }
        });
          }
          
      });
       
    }
  }})
 
});
module.exports = router;
