
// behavior
$('#Navigate .item').each((i,elem)=>{
  let target=$(elem),
      hovered=false;
  target.bind({
    'mousedown':()=>{
      target.css('background-color','rgba(80,120,220,1)');
    },
    'mouseup':()=>{
      if(hovered){
        target.css('background-color','rgba(80,160,220,1)');
      }
      else{
        target.css('background-color','rgba(0,0,0,0)');
      }
    },
    'mouseenter':()=>{
      hovered=true;
      target.css('background-color','rgba(80,160,220,1)');
    },
    'mouseleave':()=>{
      hovered=false;
      target.css('background-color','rgba(0,0,0,0)');
    }
  });
});
