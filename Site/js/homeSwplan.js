
let cur_selected;
$('#swPlan .item').each((i,elem)=>{
  $(elem).children('.tslist').attr('sheight',$(elem).children('.tslist').height());
  $(elem).children('.tslist').css('height',0);
  $(elem).click(()=>{
    let base=$(elem);
    let stage=base.children('.stage');
    let list=base.children('.tslist');
    if(base.attr('clicked')){
      cur_selected=undefined;
      base.attr('clicked','');
      list.animate({height:0},400);
      setTimeout(()=>{
        list.css('display','none');
        stage.css('display','block');
        stage.animate({height:parseInt(stage.attr('sheight'))},400);
      },400);
    }
    else{
      if(cur_selected){
        cur_selected.click();
      }
      cur_selected=base;
      base.attr('clicked','clicked');
      stage.attr('sheight',stage.height());
      stage.animate({height:0},400);
      setTimeout(()=>{
        stage.css('display','none');
        list.css('display','block');
        list.animate({height:parseInt(list.attr('sheight'))},400);
      },400);
    }
  })
});
