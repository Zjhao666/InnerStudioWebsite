
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
let navigateSelected;
$('#Navigate').children('.item').each((i,elem)=>{
  $(elem).bind({
    'click':()=>{
      if(navigateSelected!=elem){
        if(navigateSelected){
          $(navigateSelected).css({
            borderBottomWidth:0,
            fontWeight:'normal'
          });
        }
        $(elem).css({
          borderBottomWidth:2,
          fontWeight:'bold'
        });
        navigateSelected=elem;
        // display frame
        let identifier=$(elem).html();
        if(identifier.includes('Profile')){
          $('#Profile').css('display','inline-block');
          $('#CurrentProject').css('display','none');
          $('#CompletedProjects').css('display','none');
          $('#Evaluate').css('display','none');
        }
        else if(identifier.includes('Current')){
          $('#Profile').css('display','none');
          $('#CurrentProject').css('display','inline-block');
          $('#CompletedProjects').css('display','none');
          $('#Evaluate').css('display','none');
        }
        else if(identifier.includes('Completed')){
          $('#Profile').css('display','none');
          $('#CurrentProject').css('display','none');
          $('#CompletedProjects').css('display','inline-block');
          $('#Evaluate').css('display','none');
        }
        else if(identifier.includes('Evaluate')){
          $('#Profile').css('display','none');
          $('#CurrentProject').css('display','none');
          $('#CompletedProjects').css('display','none');
          $('#Evaluate').css('display','inline-block');
        }
      }
    },
    'mouseenter':()=>{
      if(navigateSelected!=elem){
        $(elem).css({
          borderBottomWidth:1
        });
      }
    },
    'mouseleave':()=>{
      if(navigateSelected!=elem){
        $(elem).css({
          borderBottomWidth:0
        });
      }
    }
  });
});

projectBindAction('#CurrentProject');
projectBindAction('#CompletedProjects');

$('#Navigate').children('.item').eq(1).click();
$('#CurrentProject .list .current').click();
