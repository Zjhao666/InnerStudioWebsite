
// click effect
let audioClickEffect=document.getElementById('AudioClickEffect');
const bing=()=>{
  if(!audioClickEffect.paused) audioClickEffect.pause();
  audioClickEffect.currentTime=0;
  audioClickEffect.play();
};

// navigate
let navigate=$('#main .navigate');
navigate.children('item').each((i,elem)=>{
  $(elem).bind({
    mouseenter:()=>{

    },
  })
});
