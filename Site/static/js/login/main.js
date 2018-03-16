

let gheight=$('#Login').height();

let audioClickEffect=document.getElementById('AudioClickEffect');
const bing=()=>{
  if(!audioClickEffect.paused) audioClickEffect.pause();
  audioClickEffect.currentTime=0;
  audioClickEffect.play();
};

$('#Login .content').click((e)=>{
  e.stopPropagation();
  bing();
  // to public website
});
$('#Login .Clocker').click((e)=>{
  e.stopPropagation();
  bing();
  // console
  $('#Login .Console').css('display','block');
  $('#Login .Console').animate({opacity:1},300);
});
$('#Login .Console').click((e)=>e.stopPropagation());

// Clocker

let Clocker=$('#Login .content .Clocker');
const updateClocker=()=>{
  let time=new Date();
  Clocker.html(''+(24-time.getHours()-1)+':'+(60-time.getMinutes()-1)+':'+(60-time.getSeconds()));
};
setInterval(updateClocker,500);
