
let state_rightmenu=false;
document.oncontextmenu=(e)=>{
  let elem=$(e.target);
  if(elem.attr('class')&&elem.attr('class').includes('file')){
    state_rightmenu=true;
    elem.click();
    let pos=elem.offset();
    $('#Rightmenu').css({
      'top':pos.top+40,
      'left':pos.left+40
    });
    $('#Rightmenu').css('display','block');
    return false;
  }
};
$('#main').click((e)=>{
  if(e.which==1&&state_rightmenu){
    state_rightmenu=false;
    $('#Rightmenu').css('display','none');
  }
});

let overview_selected;
$('#Overview .item').each((i,elem)=>{
  let target=$(elem),
      hovered=false;
  target.bind({
    'mousedown':()=>{
      target.css('background-color','rgba(80,80,180,1)');
    },
    'mouseup':()=>{
      if(hovered){
        target.css('background-color','rgba(80,100,220,1)');
      }
      else{
        target.css('background-color','rgba(0,0,0,0)');
      }
    },
    'mouseenter':()=>{
      hovered=true;
      target.css('background-color','rgba(80,100,220,1)');
    },
    'mouseleave':()=>{
      hovered=false;
      target.css('background-color','rgba(0,0,0,0)');
    },
    'click':()=>{
      // 1.behavior
      if(overview_selected&&overview_selected!==target){
        overview_selected[0].classList.remove('selected');
        overview_selected.children('span').css({
          whiteSpace:'nowrap',
          height:15,
          zIndex:0
        });
      }
      target[0].classList.add('selected');
      target.children('span').css({
        whiteSpace:'normal',
        height:'auto',
        zIndex:100
      });
      overview_selected=target;
      // 2.update [file detail]
      // get file info from server
      $('#Sidebox .filedetail .thumbnail').css('background-image',target.css('background-image'));
    },
    'dblclick':()=>{

    }
  });
});
