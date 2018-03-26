
const projectBindAction=(target)=>{
  $(target).attr('projectBinded','true');
  $(target).find('.stage').each((i,elem)=>{
    let stage=$(elem);
    if(stage.find('.comments').length>0){
      let comments=$(elem).find('.comments'),
          height=comments.height(),visible=true;
      stage.css('cursor','pointer');
      stage.click(()=>{
        if(visible){
          visible=false;
          comments.animate({height:0},300);
          setTimeout(()=>comments.css('display','none'),300);
        }
        else{
          visible=true;
          comments.css('display','block');
          comments.animate({height:height},300);
        }
      });
      stage.click();
    }
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
          $('#Profile .CurrentProject').css('display','block');
          $('#Profile .CompletedProjects').css('display','none');
          if(!$('#Profile .CurrentProject').attr('projectBinded'))
            projectBindAction($('#Frames #Profile .CurrentProject'));
        }
        else if(identifier.includes('Completed')){
          $('#Profile .CurrentProject').css('display','none');
          $('#Profile .CompletedProjects').css('display','block');
          if(!$('#Profile .CompletedProjects').attr('projectBinded'))
            projectBindAction($('#Frames #Profile .CompletedProjects'));
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

window.onload=()=>$('#Profile .Navigate').children('.item').eq(0).click();
