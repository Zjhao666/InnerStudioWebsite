
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
$('#Navigate').children('.item').eq(1).click();
