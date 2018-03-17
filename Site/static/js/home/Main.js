
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
