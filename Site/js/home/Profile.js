
const projectBindAction=(target)=>{
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
      }
    });
  });
};

// navigate
let pNavigateSelected;
$('#Profile .Navigate').children('.item').each((i,elem)=>{
  $(elem).bind({
    'click':()=>{
      if(pNavigateSelected!=elem){
        if(pNavigateSelected){
          $(pNavigateSelected).css({
            borderBottomWidth:0,
            color:'white'
          });
        }
        $(elem).css({
          borderBottomWidth:2,
          color:'rgb(200,180,120)'
        });
        pNavigateSelected=elem;
        // display frame
        let identifier=$(elem).html();
        if(identifier.includes('Current')){
          $('#Profile .CurrentProject').css('display','inline-block');
          $('#Profile .CompletedProjects').css('display','none');
          $('#Profile .Evaluate').css('display','none');
        }
        else if(identifier.includes('Completed')){
          $('#Profile .CurrentProject').css('display','none');
          $('#Profile .CompletedProjects').css('display','inline-block');
          $('#Profile .Evaluate').css('display','none');
        }
        else if(identifier.includes('Evaluate')){
          $('#Profile .CurrentProject').css('display','none');
          $('#Profile .CompletedProjects').css('display','none');
          $('#Profile .Evaluate').css('display','inline-block');
        }
      }
    },
    'mouseenter':()=>{
      if(pNavigateSelected!=elem){
        $(elem).css({
          borderBottomWidth:1
        });
      }
    },
    'mouseleave':()=>{
      if(pNavigateSelected!=elem){
        $(elem).css({
          borderBottomWidth:0
        });
      }
    }
  });
});

projectBindAction('#Profile .CurrentProject');
projectBindAction('#Profile .CompletedProjects');

$('#Profile .Navigate').children('.item').eq(0).click();
$('#Profile .CurrentProject .list .current').click();
