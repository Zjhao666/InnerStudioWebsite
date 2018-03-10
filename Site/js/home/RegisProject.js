
// overview-members-behaviors
let mpb_height;
$('#Regisproject #Overview .members').children('.btn').each((i,elem)=>{
  let hovered=false;
  $(elem).bind({
    'click':()=>{
      if($(elem).attr('class').includes('add')){

      }
      else{

      }
    },
    'mouseenter':()=>{
      hovered=true;
      $(elem).css('background-color','rgb(200,200,220)');
    },
    'mouseleave':()=>{
      hovered=false;
      $(elem).css('background-color','rgba(0,0,0,0)');
    },
    'mousedown':()=>{
      $(elem).css('background-color','rgba(100,100,100)');
    },
    'mouseup':()=>{
      if(hovered){
        $(elem).css('background-color','rgb(200,200,220)');
      }
      else{
        $(elem).css('background-color','rgba(0,0,0,0)');
      }
    }
  });
})
$('#Regisproject #Overview .members .membersOperabox .submit').bind({
  'mousedown':(e)=>{
    $(e.target).css('background-color','rgb(220,220,220)');
  },
  'mouseup':(e)=>{
    $(e.target).css('background-color','white');
  }
});
$('#Regisproject #Overview .members .add').click(()=>{
  let target=$('#Overview .members .membersOperabox');
  if(!mpb_height){
    mpb_height=target.height();
    target.height(0);
  }
  target.css('display','block');
  target.animate({height:mpb_height},300);
});
$('#Regisproject #Overview .members .membersOperabox .submit').click(()=>{
  let target=$('#Overview .members .membersOperabox');
  target.animate({height:0},300);
  setTimeout(()=>target.css('display','none'),300);
});
// navigate-behaviors
let navigateSelected;
$('#Regisproject #Navigate').children('.item').each((i,elem)=>{
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
        // change frame
        let identifier=$(elem).html();
        if(identifier.includes('Essential information')){
          $('#Regisproject #Overview').css('display','block');
          $('#Regisproject #EditStage').css('display','none');
          $('#Regisproject #Check').css('display','none');
        }
        else if(identifier.includes('Edit stages')){
          $('#Regisproject #Overview').css('display','none');
          $('#Regisproject #EditStage').css('display','block');
          $('#Regisproject #Check').css('display','none');
        }
        else if(identifier.includes('Check')){
          $('#Regisproject #Overview').css('display','none');
          $('#Regisproject #EditStage').css('display','none');
          $('#Regisproject #Check').css('display','block');
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
$('#Regisproject #Navigate').children('.item').eq(0).click();
