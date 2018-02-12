let baseUrl=window.location.href;
const jumpTo=(target)=>{
  window.location.href=target;
};
// ref
$('#ref .btn').each((i,elem)=>{
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
$('#ref .profile').click(()=>{
  jumpTo(baseUrl.replace('home.html','swPrivatePage.html'));
});
$('#ref .updateProject').click(()=>{});
$('#ref .regisProject').click(()=>{
  jumpTo(baseUrl.replace('home.html','swRegisProject.html'));
});
$('#ref .serverConsole').click(()=>{
});
$('#ref .library').click(()=>{
  jumpTo(baseUrl.replace('home.html','swDocuments.html'));
});
