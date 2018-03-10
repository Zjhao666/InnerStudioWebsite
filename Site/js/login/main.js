
let gheight=$('#Login').height();

let audioClickEffect=document.getElementById('AudioClickEffect');
const bing=()=>{
  if(!audioClickEffect.paused) audioClickEffect.pause();
  audioClickEffect.currentTime=0;
  audioClickEffect.play();
};

$('#Login .upper').click((e)=>{
  bing();
  e.stopPropagation();
  $('#Login .mask').animate({bottom:parseInt(gheight/2)},300);
});
$('#Login .lower').click((e)=>{
  bing();
  e.stopPropagation();
  $('#Login .mask').animate({bottom:0},300);
});
$('#Login .publicWay').click((e)=>{
  bing();
  e.stopPropagation();
});

let curWordsPointer=0,wordsContainer=$('#Login .mask .Overview .words'),
    overWordsList=['Nothing is impossible!What do you think?','Be honest rather clever.','Being on sea, sail; being on land, settle.','Be just to all, but trust not all.'];
wordsContainer.html(overWordsList[curWordsPointer]);
const wordsUpdate=()=>{
  wordsContainer.animate({opacity:0},200);
  setTimeout(()=>{
    curWordsPointer=(curWordsPointer+1)%overWordsList.length;
    wordsContainer.html(overWordsList[curWordsPointer]);
    wordsContainer.animate({opacity:1},200);
  },200);
};
setInterval(wordsUpdate,6000);
