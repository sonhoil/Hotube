var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var fs = require('fs')
var shortid = require('shortid');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'ggthegame2',
  database : 'hotube'
});
db.connect();
/* GET home page. */
var pageID = [] 
router.get('/:pageId', function(request, res, next) {
  db.query(`SELECT * FROM post LIMIT 5;`,function(error4,videoList){
    var date = new Date();
    var post = request.body;
   
    pageID.push(request.params.pageId)
    console.log("pageID 확인!",pageID)
    if(pageID[0]){
      db.query('SELECT * FROM post LEFT JOIN users ON post.userID = ID WHERE post.postID = ?',[pageID[0]],function(error2,resultVideo){
        console.log("리로딩 리턴",resultVideo)
         if(request.query.reply){
           db.query(`SELECT * FROM users WHERE ID = ?;`,[request.user.id], function(err,resultreply2){
             db.query( `INSERT INTO reply (replyID, postID, userID, reply, Date) 
             VALUES(?, ?, ?, ?, ?)`,
           [shortid.generate(),resultVideo[0].postID,resultreply2[0].id,request.query.reply, date], 
           function(error2,resultreply){
             
           })
           })
         }
         db.query(`SELECT * FROM reply LEFT JOIN users ON reply.userID = ID WHERE reply.postID = ?`,[pageID[0]],function(error3,showreply){
           if(error3){
             throw error3
           }else{
             if(error2){
               throw error2
             }else{
               showreply.map((item,k)=>{
                 if(item.image){
                   showreply[k].image = new Buffer( showreply[k].image, 'binary' ).toString('base64');
                 }
               })
               showreply = showreply.reverse()
             
               if(resultVideo[0].image){
                 var videoprofile = new Buffer( resultVideo[0].image, 'binary' ).toString('base64');
               }
              
               
               var videos = fs.readFileSync(resultVideo[0].video); // path로 파일 읽어오기
               var videoURL = new Buffer( videos, 'binary' ).toString('base64');// 읽은 바이너리 파일 전환 
               if(request.user){
                 if(request.user.image){
                   db.query(`SELECT * FROM users WHERE ID = ?;`,[request.user.id], function(err,result){
                     var bufferBase64 = new Buffer( result[0].image, 'binary' ).toString('base64');
                     pageID = [] 
                   if(err){
                     res.render('videopage', { title: 'Main', login: request.user, videoprofile: videoprofile, videoInfo: resultVideo[0],videos: videoURL,replys:showreply, videoList: videoList});
                   }else{
                     res.render('videopage', { title: 'Main', login: request.user, image: bufferBase64, videoprofile: videoprofile, videoInfo: resultVideo[0],videos: videoURL,replys:showreply, videoList: videoList});
                   }
                 })
             }else{
               res.render('videopage', { title: 'Main', login: request.user, videoInfo: resultVideo[0],videos: videoURL, videoprofile: videoprofile,replys:showreply, videoList: videoList});
             }
               }
               else{
               res.render('videopage', { title: 'Main', login: request.user,  videoInfo: resultVideo[0],videos: videoURL, videoprofile: videoprofile,replys:showreply, videoList: videoList});
             }
             }
           }
         })
       })
    }
  })
});

module.exports = router;
