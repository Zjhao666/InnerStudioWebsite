let baseUrl=window.location.href;
const jumpTo=(target)=>{
  window.location.href=target;
};
// Ref
$('#Ref .btn').each((i,elem)=>{
  $(elem).bind({
    'click':()=>{},
    'mousedown':(e)=>{
      $(e.target).css('background-color','rgb(220,220,220)');
    },
    'mouseup':(e)=>{
      $(e.target).css('background-color','white');
    }
  });
});
$('#Ref .profile').click(()=>{
  jumpTo(baseUrl.replace('home.html','privatePage.html'));
});
$('#Ref .updateProject').click(()=>{});
$('#Ref .regisProject').click(()=>{
  jumpTo(baseUrl.replace('home.html','regisProject.html'));
});
$('#Ref .serverConsole').click(()=>{
});
$('#Ref .library').click(()=>{
  jumpTo(baseUrl.replace('home.html','documents.html'));
});
