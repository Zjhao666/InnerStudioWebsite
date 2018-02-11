
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
        // display frame
        let identifier=$(elem).html();
        if(identifier.includes('Current')){
          $('#currentProject').css('display','inline-block');
          $('#completedProjects').css('display','none');
          $('#editProfile').css('display','none');
        }
        else if(identifier.includes('Completed')){
          $('#currentProject').css('display','none');
          $('#completedProjects').css('display','inline-block');
          $('#editProfile').css('display','none');
        }
        else if(identifier.includes('Profile')){
          $('#currentProject').css('display','none');
          $('#completedProjects').css('display','none');
          $('#editProfile').css('display','inline-block');
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
$('#navigate').children('.item').eq(0).click();
