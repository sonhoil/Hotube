var cookie = require('cookie');

module.exports = {
  HTML:function(){
    var div = `
    div.video
    img(src="../images/coding.jpg")
    div.videoDetail
      img.profile(src="../images/coding.jpg")
      a.videoName 비디오 제목 
    `
    
    return div;
  }
}
