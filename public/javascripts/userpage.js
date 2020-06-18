const LeftMenu = document.querySelector('.LeftMenu');
const LeftList = document.querySelector('.LeftList');
const userbanner = document.querySelector('.userbanner');
var leftbarbutton = document.getElementsByClassName('leftbarbutton');
leftbarbutton[0].addEventListener("click",handleLeftBar)

let h = 1;
function handleLeftBar(x) {
    if(h === 0){
      LeftMenu.style.width= '174px';
     
      LeftList.style.visibility= 'visible';
      LeftMenu.style.transition = '0.2s'
      h = 1
    }else if(h === 1){
      LeftMenu.style.width= '0px';
      LeftList.style.visibility= 'hidden';
      LeftMenu.style.transition = '0.2s'
      h = 0;
    }
  }
 

const previewVideo = document.querySelector('.preview')
const file = document.querySelector('.getfile');
file.onchange = function(){
  console.log("ok")
    var fileList = file.files;
    var reader = new FileReader();
    reader.readAsDataURL(fileList[0])
    reader.onload = function() {
   console.log(reader.result)
    previewVideo.src = reader.result;
    setTimeout(capture, 3000);
    
        
    }

      /*   tempImage.onload = function(){
            var canvas = document.createElement('canvas');
            var canvasContext = canvas.getContext("2d");
            console.log("ok")
            //캔버스 크기 설정
            canvas.width = 100; //가로 100px
            canvas.height = 100; //세로 100px

            //이미지를 캔버스에 그리기
            canvasContext.drawImage(this, 0, 0, 100, 100);
            var dataURI = canvas.toDataURL("image/jpeg");

            //썸네일 이미지 보여주기
            document.querySelector('.thumbnail').src = dataURI;
        } */
    }


function capture(){
    var canvas = document.querySelector('.canvas');
    var video = document.querySelector('.preview');
    canvas.getContext('2d').drawImage(video, 0, 0, 295, 165);
    var dataURI = canvas.toDataURL("image/jpeg");
    document.querySelector('.returnthumnail').value=dataURI;
    console.log(dataURI)
}
