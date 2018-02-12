
// members
$('#overview .members').children('.btn').each((i,elem)=>{
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
$('#overview .members .membersOperabox .submit').bind({
  'mousedown':(e)=>{
    $(e.target).css('background-color','rgb(220,220,220)');
  },
  'mouseup':(e)=>{
    $(e.target).css('background-color','white');
  }
});

// navigate
let navigateSelected;
$('#navigate').children('.item').each((i,elem)=>{
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
          $('#overview').css('display','block');
          $('#editStage').css('display','none');
          $('#check').css('display','none');
        }
        else if(identifier.includes('Edit stages')){
          $('#overview').css('display','none');
          $('#editStage').css('display','block');
          $('#check').css('display','none');
        }
        else if(identifier.includes('Check')){
          $('#overview').css('display','none');
          $('#editStage').css('display','none');
          $('#check').css('display','block');
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
$('#navigate').children('.item').eq(2).click();
