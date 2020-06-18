var leftbarbutton = document.getElementsByClassName('leftbarbutton');
var leftBar = document.getElementsByClassName('LeftMenu')
var list1 = document.getElementsByClassName('list1')
var list2 = document.getElementsByClassName('list2')
var list3 = document.getElementsByClassName('list3')


let i = 0;
function handleLeftBar(x) {
  if(i === 0){
    leftBar[0].style.width = '170px'
    leftBar[0].style.transition = '0.1s'

    list1[0].innerHTML = "12as"
    list2[0].innerHTML = "자세히보기"
    list3[0].innerHTML = "ㅐㅏㅐㅏㅐ"
    i = 1;
  }else if(i === 1){
    leftBar[0].style.width = '74px'
    list1[0].innerHTML = "a"
    list2[0].innerHTML = "a"
    list3[0].innerHTML = "a"
    i = 0;
  }
}

leftbarbutton[0].addEventListener("click",handleLeftBar );
