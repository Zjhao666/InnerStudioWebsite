
// init
$('#HomeNavigate .Ref .wrapper').height($('#HomeNavigate').height()-$('#HomeNavigate .Ref').offset().top);
$('#Frames').width($('#main').width()-220-50);

// click effect
let audioClickEffect=document.getElementById('AudioClickEffect');
const bing=()=>{
  if(!audioClickEffect.paused) audioClickEffect.pause();
  audioClickEffect.currentTime=0;
  audioClickEffect.play();
};
// Ref item clicked
let homeNavigateSelected=$('#Profile');
$('#HomeNavigate .Ref .item').each((i,elem)=>$(elem).mousedown(()=>{
  bing();
  $(elem).css('opacity',0);
  $(elem).animate({opacity:1},500);
}));
(function(){
  for(let item of ['Profile','Plan','Project','Communicate','Regisproject','Serverconsole','Documents','Members']){
    let target=$('#HomeNavigate .Ref .wrapper .ref'+item);
    target.click(()=>{
      let view=$('#'+item);
      if(homeNavigateSelected){
        homeNavigateSelected.css('display','none');
        homeNavigateSelected=undefined;
      }
      view.css('display','block');
      homeNavigateSelected=view;
    });
  }
})();


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
