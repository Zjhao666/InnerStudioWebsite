
let gheight=$('#Login').height();

let beBottom=true;
$('#Login .mask').click(()=>{
  if(beBottom){
    beBottom=false;
    $('#Login .mask').animate({bottom:parseInt(gheight/2)},300);
  }
  else{
    beBottom=true;
    $('#Login .mask').animate({bottom:0},300);
  }
});
