
/* Left */

$('#Overview .Other').height($(document).height()-$('#Overview .Other').offset().top);

// click effect
let audioClickEffect=document.getElementById('AudioClickEffect');

// Ref
$('#Overview .Ref .item').each((i,elem)=>{
  let mask;
  $(elem).bind({
    mouseenter:()=>{
      if(mask) mask.remove();
      mask=$(`<a style='
      display:block;
      position:absolute;
      height:30px;width:0px;
      left:0px;top:0px;
      background:rgb(0,0,0,0.7);
      z-index:-1;
      '></a>`);
      mask.appendTo(elem);
      mask.animate({width:240},300);
    },
    mouseleave:()=>{
      mask.animate({left:240},300);
    },
    mousedown:()=>{
      mask.css('background-color','rgb(20,20,20,0.7)');
    },
    mouseup:()=>{
      mask.css('background-color','rgb(0,0,0,0.7)');
    }
  });
});

let lastItemSelected;
const refItemBind=(itemNames)=>{
  for(let name of itemNames){
    $('#Overview .Ref .'+name).click(()=>{
      if(!audioClickEffect.paused) audioClickEffect.pause();
      audioClickEffect.currentTime=0;
      audioClickEffect.play();
      if(lastItemSelected) lastItemSelected.css('display','none');
      lastItemSelected=$('#Right #'+name);
      lastItemSelected.css('display','block');
    });
  }
};
refItemBind(['Profile','Plan','Project','Communicate','Regisproject','Serverconsole']);
$('#Overview .Ref .Document').click(()=>{
  window.open('documents.html');
});
// Members
$('#Members .item').each((i,elem)=>{
  let mask;
  $(elem).bind({
    mouseenter:()=>{
      if(mask) mask.remove();
      mask=$(`<a style='
      display:block;
      position:absolute;
      height:30px;width:0px;
      left:0px;top:0px;
      background:rgba(100,80,200,0.6);
      z-index:-1;
      '></a>`);
      mask.appendTo(elem);
      mask.animate({width:210},300);
    },
    mouseleave:()=>{
      mask.animate({left:210},300);
    },
    mousedown:()=>{
      mask.css('background-color','rgba(80,60,180,0.8)');
    },
    mouseup:()=>{
      mask.css('background-color','rgba(100,80,200,0.6)');
    }
  });
});

// ----------------------------------------

/* Right */

$('#Right').width($(document).width()-$('#Left').width()-4);

// ----------------------------------------
