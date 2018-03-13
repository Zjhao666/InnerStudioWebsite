

// make stars
let starsContainer=$('#main .stars'),starsArray=[],
    swidth=$('#main').width(),sheight=$('#main').height()
    xrange=parseInt(swidth/2),
    yrange=parseInt(sheight/2);
const randNum=()=>{
  return Math.random()*100+50;
};
const randInfo=()=>{
  return {
    x:parseInt(Math.random()*swidth-xrange),
    y:parseInt(Math.random()*sheight-yrange),
    m:parseInt(Math.random()*5),
    c:'rgb('+randNum()+','+randNum()+','+randNum()+')'
  };
};
const makeStars=()=>{
  let shadow='';
  for(let i=0;;i++){
    let star=randInfo();
    starsArray.push(star);
    shadow+=star.x+'px '+star.y+'px '+star.m+'px '+star.c;
    if(i<100) shadow+=',';
    else break;
  }
  starsContainer.css('box-shadow',shadow);
};
const starsUpdate=()=>{
  let shadow='';
  for(let i=0;;i++){
    let star=starsArray[i];
    star.x+=parseInt(Math.random()*4-2);
    star.y+=parseInt(Math.random()*4-2);
    shadow+=star.x+'px '+star.y+'px '+star.m+'px '+star.c;
    if(i<100) shadow+=',';
    else break;
  }
  starsContainer.css('box-shadow',shadow);
};
makeStars();
// setInterval(starsUpdate,100);
