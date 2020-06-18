var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var stream = require('stream');
var template = require('../template/template')
var bufferStream = new stream.PassThrough();
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'ggthegame2',
  database : 'hotube'
});
db.connect();


/* GET home page. */
router.get('/', function(request, res, next) {
  db.query('SELECT * FROM post LEFT JOIN users ON post.userID = ID ',function(error2,resultVideo){
   resultVideo.map((item,k)=> {if(item.image){
    var imagebuffer = new Buffer( item.image, 'binary' ).toString('base64');
    resultVideo[k].image = imagebuffer;
  }})
    if(request.user){
      if(request.user.image){
        db.query(`SELECT image FROM users WHERE ID = ?;`,[request.user.id], function(err,result){
          var bufferBase64 = new Buffer( result[0].image, 'binary' ).toString('base64');
        
        if(err){
          res.render('index', { title: 'Main', login: request.user, videos:resultVideo});
        }else{
          res.render('index', { title: 'Main', login: request.user, image: bufferBase64, videos:resultVideo});
        }
      })
  }else{
    res.render('index', { title: 'Main', login: request.user, videos:resultVideo});
  }
    }
    else{
    res.render('index', { title: 'Main', login: request.user, videos:resultVideo});
  }  
  })
});

router.get('/userpage', function(request, res, next) {
  if(request.user){
    db.query(`SELECT * FROM post WHERE UserID = ?;`,[request.user.id],function(err2, resultVideo){
    if(request.user.image){
      db.query(`SELECT image FROM users WHERE ID = ?;`,[request.user.id], function(err,result){
          var bufferBase64 = new Buffer( result[0].image, 'binary' ).toString('base64');
        if(err){
          res.render('userpage', { title: 'Main', login: request.user, username: request.user.nickname, videos: resultVideo});
        }else{
          res.render('userpage', { title: 'Main', login: request.user, image: bufferBase64, username: request.user.nickname, videos: resultVideo});
        }
        })
    
}else{
  res.render('userpage', { title: 'Main', login: request.user, username: request.user.nickname, videos: resultVideo});
}
  })
  }
  else{
  res.render('index', { title: 'Main', login: request.user, username: request.user.nickname});
}
  
});
module.exports = router;
