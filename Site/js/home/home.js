let baseUrl=window.location.href;
const open=(target)=>{
  window.open(target);
};
// Ref
$('#Ref .btn').each((i,elem)=>{
  $(elem).bind({
    'click':()=>{},
    'mousedown':(e)=>{
      $(e.target).css('background-color','rgb(220,220,220)');
    },
    'mouseup':(e)=>{
      $(e.target).css('background-color','rgba(220,220,220,0.8)');
    },
    'mouseleave':(e)=>{
      $(e.target).css('background-color','rgba(220,220,220,0.8)');
    }
  });
});
$('#Ref .profile').click(()=>{
  open(baseUrl.replace('home.html','privatePage.html'));
});
$('#Ref .updateProject').click(()=>{

});
$('#Ref .regisProject').click(()=>{
  open(baseUrl.replace('home.html','regisProject.html'));
});
$('#Ref .serverConsole').click(()=>{
  open(baseUrl.replace('home.html','serverConsole.html'));
});
$('#Ref .library').click(()=>{
  open(baseUrl.replace('home.html','documents.html'));
});
