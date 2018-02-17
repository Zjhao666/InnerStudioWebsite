

let plan_activited;
$('#Plan .item').each((i,elem)=>{
  let visiable=false,height,
      curstage=$(elem).children('.curstage'),
      stages=$(elem).children('.list');
  const commentsBindAction=(target)=>{
    if(!$(target).attr('actionBinded')){
      $(target).attr('actionBinded','True');
      $(target).find('.stage').each((i,elem)=>{
        let visiable=false,height,stage=$(elem),
        comments=stage.find('.comments'),
        beCurrent=stage.attr('class').includes('current');
        stage.click(()=>{
          if(visiable){
            visiable=false;
            if(beCurrent){
              stage.find('.btn').css('display','none');
            }
            comments.animate({height:0},300);
            stages.animate({height:stages.height()-height},500);
            setTimeout(()=>comments.css('display','none'),300);
          }
          else{
            visiable=true;
            if(!height){
              height=comments.height();
              comments.height(0);
            }
            if(beCurrent){
              stage.find('.btn').css('display','block');
            }
            comments.css('display','block');
            comments.animate({height:height},300);
            stages.animate({height:stages.height()+height},500);
          }
        });
      });
    }
  };
  const onClick=()=>{
    commentsBindAction(elem);
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
  };
  $(elem).children('.title').click(onClick);
  $(elem).children('.overview').click(onClick);
});
