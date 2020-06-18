var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var stream = require('stream');
var template = require('../template/template')

var shortid = require('shortid');
var multer  = require('multer')
const upload = multer({
  storage: multer.memoryStorage(),
});
const uploadVideo = multer({dest:'uploads/'})
var bufferStream = new stream.PassThrough();

var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'ggthegame2',
  database : 'hotube'
});
db.connect();

router.post('/updateprofile',upload.single('avatar'),function(request, response, next) {

  if(request.file){
    db.query(`UPDATE users SET image = ? WHERE id = ?`,[request.file.buffer,request.user.id],function(err,result){
      response.redirect(`/userpage`)
    })
    
  }else{
    response.redirect(`/userpage`)
  }
  
});




router.post('/uploadVideo',uploadVideo.single('video'),function(request, response, next) {
 
  var date = new Date();
  var post = request.body;
  db.query(`INSERT INTO post (postID, userID, title, discription,date, video, thumnail) 
            VALUES(?, ?, ?, ?, ?, ?, ?)`,
          [shortid.generate(),request.user.id, post.title, post.discription, date, request.file.path,post.image], function(err,result){
            if(err){
              throw err
            }else{
              response.redirect(`/userpage`)
            }
            
          })
  
});


router.post('/delete', (request, response, next) =>
{
            var post = request.body;
            var id = post.videoID;
            db.query(`DELETE FROM post WHERE postID=?`,[id],
            function(error){
              if(error){
                next(error)
              }
              response.redirect( `/userpage`);
        }); 
}
)
/* GET home page. */


router.get('/_userpage_:userID', function(request, res, next) {
  console.log("유저 페이지",request.params)
  db.query(`SELECT * FROM users WHERE id =?`,[request.params.userID],function(err,result){
      if(err){
        throw err
      }else{
        if(result[0].image){
          var imagebuffer = new Buffer( result[0].image, 'binary' ).toString('base64');
        }
        db.query(`SELECT * FROM post WHERE userID=?`,[request.params.userID],function(err2,result2){
          if(err2){
            throw err2
          }else{
            res.render('_userpage', { title: 'userPage',profile: imagebuffer,userinfo:result[0],videoinfo:result2});
          }
        })
      }
  })

});
module.exports = router;
