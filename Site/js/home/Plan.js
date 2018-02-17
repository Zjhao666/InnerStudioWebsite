
let plan_activited;
$('#Plan .item').each((i,elem)=>{
  let visiable=false,height,
      curstage=$(elem).children('.curstage'),
      stages=$(elem).children('.list');
  $(elem).click(()=>{
    if(visiable){
      visiable=false;
      plan_activited=undefined;
      stages.animate({height:0},500);
      setTimeout(()=>{
        stages.css('display','none');
        curstage.css('display','block');
        curstage.animate({height:30},200);
      },520);
    }
    else{
      visiable=true;
      if(plan_activited) plan_activited.click();
      plan_activited=$(elem);
      if(!height){
        height=stages.height();
        stages.height(0);
      }
      curstage.animate({height:0},200);
      setTimeout(()=>{
        curstage.css('display','none');
        stages.css('display','block');
        stages.animate({height:height},500);
      },220)
    }
  });
});
