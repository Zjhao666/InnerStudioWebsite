
let comm_activited;
$('#Communicate .item').each((i,elem)=>{
  let folded=true,
      content=$(elem).children('.content'),
      interact=$(elem).children('.interact'),
      height=interact.height();
  interact.height(0);
  $(elem).click(()=>{
    if(folded){
      if(comm_activited){
        comm_activited.click();
      }
      comm_activited=$(elem);
      folded=false;
      content.css('white-space','normal');
      interact.css('display','block');
      interact.animate({height:height},500);
    }
    else{
      comm_activited=undefined;
      folded=true;
      interact.animate({height:0},500);
      setTimeout(()=>{
        interact.css('display','none');
        content.css('white-space','nowrap');
      },500);
    }
  });
});
