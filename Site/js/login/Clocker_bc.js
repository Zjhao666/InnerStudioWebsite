
let clocker=document.getElementById('Clocker'),
    clockCtx=clocker.getContext('2d'),lineLength,numberWidth=30;

let beConsole=false;
$(clocker).click((e)=>{
  bing();
  if(beConsole){
    beConsole=false;
    $('#Login .mask .Console').animate({opacity:0},200);
    setTimeout(()=>{
      $('#Login .mask .Console').css('display','none');
      $('#Login .mask .Overview').css('display','block');
      $('#Login .mask .Overview').animate({opacity:1},200);
    },200);
  }
  else{
    beConsole=true;
    $('#Login .mask .Overview').animate({opacity:0},200);
    setTimeout(()=>{
      $('#Login .mask .Overview').css('display','none');
      $('#Login .mask .Console').css('display','block');
      $('#Login .mask .Console').animate({opacity:1},200);
    },200);
  }
  e.stopPropagation();
});
const getCurTime=()=>{
  let time=new Date();
  return {h:24-time.getHours()-1,m:60-time.getMinutes()-1,s:60-time.getSeconds()};
};
const drawNumber=(num,basex,basey)=>{
  switch(num){
  case 0:
    clockCtx.moveTo(basex,basey);
    clockCtx.lineTo(basex,basey+2*lineLength);
    clockCtx.lineTo(basex+lineLength,basey+2*lineLength);
    clockCtx.lineTo(basex+lineLength,basey);
    clockCtx.lineTo(basex,basey);
    break;
  case 1:
    clockCtx.moveTo(basex+lineLength,basey);
    clockCtx.lineTo(basex+lineLength,basey+2*lineLength);
    break;
  case 2:
    clockCtx.moveTo(basex,basey);
    clockCtx.lineTo(basex+lineLength,basey);
    clockCtx.lineTo(basex+lineLength,basey+lineLength);
    clockCtx.lineTo(basex,basey+lineLength);
    clockCtx.lineTo(basex,basey+2*lineLength);
    clockCtx.lineTo(basex+lineLength,basey+2*lineLength);
    break;
  case 3:
    clockCtx.moveTo(basex,basey);
    clockCtx.lineTo(basex+lineLength,basey);
    clockCtx.lineTo(basex+lineLength,basey+lineLength);
    clockCtx.lineTo(basex,basey+lineLength);
    clockCtx.moveTo(basex+lineLength,basey+lineLength);
    clockCtx.lineTo(basex+lineLength,basey+2*lineLength);
    clockCtx.lineTo(basex,basey+2*lineLength);
    break;
  case 4:
    clockCtx.moveTo(basex,basey);
    clockCtx.lineTo(basex,basey+lineLength);
    clockCtx.lineTo(basex+lineLength,basey+lineLength);
    clockCtx.lineTo(basex+lineLength,basey);
    clockCtx.moveTo(basex+lineLength,basey+lineLength);
    clockCtx.lineTo(basex+lineLength,basey+2*lineLength);
    break;
  case 5:
    clockCtx.moveTo(basex+lineLength,basey);
    clockCtx.lineTo(basex,basey);
    clockCtx.lineTo(basex,basey+lineLength);
    clockCtx.lineTo(basex+lineLength,basey+lineLength);
    clockCtx.lineTo(basex+lineLength,basey+2*lineLength);
    clockCtx.lineTo(basex,basey+2*lineLength);
    break;
  case 6:
    clockCtx.moveTo(basex+lineLength,basey);
    clockCtx.lineTo(basex,basey);
    clockCtx.lineTo(basex,basey+2*lineLength);
    clockCtx.lineTo(basex+lineLength,basey+2*lineLength);
    clockCtx.lineTo(basex+lineLength,basey+lineLength);
    clockCtx.lineTo(basex,basey+lineLength);
    break;
  case 7:
    clockCtx.moveTo(basex,basey);
    clockCtx.lineTo(basex+lineLength,basey);
    clockCtx.lineTo(basex+lineLength,basey+2*lineLength);
    break;
  case 8:
    clockCtx.moveTo(basex,basey);
    clockCtx.lineTo(basex+lineLength,basey);
    clockCtx.lineTo(basex+lineLength,basey+2*lineLength);
    clockCtx.lineTo(basex,basey+2*lineLength);
    clockCtx.lineTo(basex,basey);
    clockCtx.moveTo(basex,basey+lineLength);
    clockCtx.lineTo(basex+lineLength,basey+lineLength);
    break;
  case 9:
    clockCtx.moveTo(basex+lineLength,basey+lineLength);
    clockCtx.lineTo(basex,basey+lineLength);
    clockCtx.lineTo(basex,basey);
    clockCtx.lineTo(basex+lineLength,basey);
    clockCtx.lineTo(basex+lineLength,basey+2*lineLength);
    clockCtx.lineTo(basex,basey+2*lineLength);
    break;
  }
};
const drawTime=()=>{
  let time=getCurTime(),a,b,basex=20,basey=20;
  // draw hours
  b=time.h%10;
  a=(time.h-b)/10;
  drawNumber(a,basex,basey);
  basex+=lineLength+10;
  drawNumber(b,basex,basey);
  // draw minutes
  basex+=lineLength+numberWidth;
  b=time.m%10;
  a=(time.m-b)/10;
  drawNumber(a,basex,basey);
  basex+=lineLength+10;
  drawNumber(b,basex,basey);
  // draw seconds
  basex+=lineLength+numberWidth;
  b=time.s%10;
  a=(time.s-b)/10;
  drawNumber(a,basex,basey);
  basex+=lineLength+10;
  drawNumber(b,basex,basey);
  clockCtx.stroke();
  clockCtx.stroke();
};
function clockUpdate(){
  clockCtx.restore();
  clockCtx.save();
  // resize
  clocker.width=$(clocker).width();
  clocker.height=$(clocker).height();
  lineLength=parseInt($(clocker).height()*0.3);
  clockCtx.strokeStyle='white';
  // draw
  drawTime();
}
setInterval(clockUpdate,500);
