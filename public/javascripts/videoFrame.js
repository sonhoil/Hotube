/* Get Our Elements */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const toggle = player.querySelector('.toggle');
const timer = player.querySelector(".timer");
const fullScreen = player.querySelector(".fullscreen");
/* Build out functions */
function togglePlay() {
  const method = video.paused ? 'play' : 'pause';
  video[method]();
}
const LeftMenu = document.querySelector('.LeftMenu');
const LeftList = document.querySelector('.LeftList');
var leftbarbutton = document.getElementsByClassName('leftbarbutton');
leftbarbutton[0].addEventListener("click",handleLeftBar)
console.log(leftbarbutton)

let j = 0;
function handleLeftBar(x) {
  if(j === 0){
      LeftMenu.style.width= '174px';
      LeftList.style.visibility= 'visible';
      LeftMenu.style.transition = '0.2s'
    j = 1
  }else if(j === 1){
      LeftMenu.style.width= '0px';
      LeftList.style.visibility= 'hidden';
      LeftMenu.style.transition = '0.2s'
    j = 0;
  }
}


function updateButton() {
  const icon = video.paused ? '►' : '❚ ❚';
  toggle.textContent = icon;
}
let i = 0;
fullScreen.addEventListener("click", fullscreen);
function fullscreen(){
    if(i===0){
        if (player.requestFullscreen) {
            player.requestFullscreen();
          } else if (player.mozRequestFullScreen) {
            player.mozRequestFullScreen();
          } else if (player.webkitRequestFullscreen) {
            player.webkitRequestFullscreen();
          } else if (player.msRequestFullscreen) { 
            player.msRequestFullscreen();
          }
          fullScreen.innerHTML = "Origin"
          i = 1
    }else if(i ===1){
       document.exitFullscreen()
        fullScreen.innerHTML = "FULL"
        i = 0;
    }
   
}


/* Hook up the event listners */
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);

toggle.addEventListener('click', togglePlay);

const skipButtons = player.querySelectorAll('[data-skip]');
/* Build out functions */
function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}
/* Hook up the event listeners */
skipButtons.forEach(button => {
  button.addEventListener('click', skip);
});


/* Get Our Elements */
const ranges = player.querySelectorAll('.player__slider');
/* Build out functions */
function handleRangeUpdate() {
  video[this.name] = this.value;
}
/* Hook up the event listeners */
ranges.forEach(range => {
  range.addEventListener('change', handleRangeUpdate);
  range.addEventListener('mousemove', handleRangeUpdate);
});


/* Get Our Elements */
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
/* Build out functions */
progressBar.style.flexBasis = '0%';
function handleProgress(e) {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
  settime(parseInt(video.currentTime))
}

function settime(time) {
    if(time < 10){
        timer.innerHTML = `00:0${parseInt(time)}`
    }else if(10 <= time < 60){
        timer.innerHTML = `00:${parseInt(time)}`
    }
    if(time >= 60){
        var min = time/60;
        var sec = time%60;
        if(sec < 10 && min < 10){
            timer.innerHTML = `0${parseInt(min)}:0${parseInt(sec)}`
        }else if(sec >= 10 && min < 10){
            timer.innerHTML = `0${parseInt(min)}:${parseInt(sec)}`
        }else if(sec >= 10 && min >= 10){
            timer.innerHTML = `${parseInt(min)}:${parseInt(sec)}`
        }else if(sec < 10 && min >= 10){
            `${parseInt(min)}:0${parseInt(sec)}`
        }
    }
}
function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
  console.log(parseInt(video.currentTime))
}
/* Hook up the event listeners */
video.addEventListener('timeupdate', handleProgress);
let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', e => {
  mousedown && scrub(e);
});
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);


