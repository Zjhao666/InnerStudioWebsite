
let comm_activited;
$('#Communicate .item').each((i,elem)=>{
  let folded=true,
      content=$(elem).children('.content'),
      interact=$(elem).children('.interact'),
      height=interact.height(),
      contentheight;
  interact.height(0);
  content.css('white-space','normal');
  contentheight=content.height();
  content.css('white-space','nowrap');
  content.height(22);
  $(elem).click(()=>{
    if(folded){
      if(comm_activited){
        comm_activited.click();
      }
      comm_activited=$(elem);
      folded=false;
      content.css('white-space','normal');
      content.animate({height:contentheight},500);
      interact.css('display','block');
      interact.animate({height:height},500);
    }
    else{
      comm_activited=undefined;
      folded=true;
      interact.animate({height:0},500);
      content.animate({height:22},500);
      setTimeout(()=>{
        interact.css('display','none');
        content.css('white-space','nowrap');
      },500);
    }
  });
});
