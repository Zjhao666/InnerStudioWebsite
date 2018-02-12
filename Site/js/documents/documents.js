let baseurl=window.location.origin+'/';
let curpath=$('.header .input_path').val();
let max_path=curpath;
let cur_selected;
let detail_target;
let spdf={
  total_pages:0,
  min_scale:1,
  max_scale:4,
  page:0,
  scale:2,
  src:undefined
};
const loadImage=(src,callback)=>{
  let width=0,height=0;
  let image=new Image();
  image.src=src;
  let t=setInterval(()=>{
    if(image.width!=0&&image.height!=0){
      clearInterval(t);
      callback(src);
    }
  },100);
}
// api
const file_detail=(target)=>{
  $.get({
    url:baseurl+'fileDetail.do?target='+target,
    dataType:'JSON',
    success:(rep)=>{
      if(rep.status_code===201){
        console.log('Not exists');
      }
      else{
        detail_target=cur_selected;
        $('.sidebox .filedetail .thumbnail').css('background-image',rep.backgroundImage);
        $('.sidebox .filedetail .title a').html(rep.title);
        $('.sidebox .filedetail .location a').html(rep.location);
        $('.sidebox .filedetail .type a').html(rep.type);
        $('.sidebox .filedetail .size a').html(rep.size);
        $('.sidebox .filedetail .create a').html(rep.time_create);
        $('.sidebox .filedetail .access a').html(rep.time_access);
        $('.sidebox .filedetail .modify a').html(rep.time_modified);
      }
    }
  });
};
const path_to=(target)=>{
  $.get({
    url:baseurl+'pathTo.do?target='+target,
    dataType:'JSON',
    success:(rep)=>{
      if(rep.status_code===201){
        console.log('Not exists');
      }
      else if(rep.status_code===202){
        console.log('Not a dir');
      }
      else{
        $('#main .overviewer .itemlist').html(rep.html);
        $('.header .input_path').val(target);
        curpath=target;
        viewer_item_init();
      }
    }
  });
}
const edit_get=(target)=>{
  $.get({
    url:baseurl+'fileGet.do?target='+target,
    dataType:'text',
    success:(rep)=>{
      if(rep){
        $('.tools .editor .textfield').val(rep);
      }
      else{
        console.log(rep);
      }
    }
  });
};
const edit_save=(target,content)=>{
  $.post({
    url:baseurl+'editSave.do?target='+target,
    dataType:'JSON',
    data:{
      'csrfmiddlewaretoken':$.cookie('csrftoken'),
      'content':content
    },
    success:(rep)=>{
      if(rep){
        msgbox_show('file saved successfully');
      }
      else{
        msgbox_show('failed to save file');
      }
    }
  });
};
const filetree_open=(target,elem)=>{
  const ergodic_bind=(base,e)=>{
    $(e).children().each((i,elem)=>{
      let location=base+'/'+$(elem).children('span').html();
      if($(elem).children().length>0){
        $(elem).bind({
          'click':(event)=>{
            filetree_open(location,elem);
            event.stopPropagation();
          },
          'dblclick':(event)=>{
            path_to(location);
            event.stopPropagation();
          }
        });
        ergodic_bind(location);
      }
      else if(!$(elem).is('span')){
        $(elem).click((event)=>{
          event.stopPropagation();
        });
      }
    });
  };
  elem=($(elem).is('span'))?$(elem).parent()[0]:elem;
  if($(elem).attr('clicked')){
    $(elem).attr('clicked','');
    // fold
    const ergodic_fold=(a)=>{
      jelem=$(a);
      if(!jelem.is('span')){
        if(a!=elem){
          jelem.css('display','none');
          jelem.attr('clicked','');
        }
        if(jelem.children().length>1){
          jelem.children().each((i,e)=>{
            ergodic_fold(e);
          });
        }
      }
    };
    ergodic_fold(elem);
  }
  else if($(elem).attr('loaded')){
    $(elem).attr('clicked','clicked');
    // display
    $(elem).children().each((i,e)=>{
      if(!$(e).is('span')){
        $(e).css('display','block');
      }
    });
  }
  else{
    $(elem).attr('clicked','clicked');
    $(elem).attr('loaded','loaded');
    $.get({
      url:baseurl+'filetreeOpen.do?target='+target,
      dataType:'JSON',
      success:(rep)=>{
        let html='';
        for(let i=0,item;i<rep.length;i++){
          item=rep[i];
          if(item.isdir){
            html+='<a class="dir"><span>'+item.name+'</span></a>';
          }
          else{
            html+='<a class="file">'+item.name+'</a>';
          }
        }
        $(elem).append($(html));
        ergodic_bind(target,elem);
      }
    });
  }
};
const delete_file=(target)=>{
  $.get({
    url:baseurl+'deleteFile.do?target='+target,
    dataType:'JSON',
    success:(rep)=>{
      path_to(curpath); // refresh
    }
  });
};
// func
const loading_on=()=>{
  $('.loding').css('display','block');
};
const loading_off=()=>{
  $('.loding').css('display','none');
};
const pdf_update=()=>{
  spdf.src.getPage(spdf.page).then((page)=>{
    let viewport=page.getViewport(spdf.scale);
    let canvas=document.querySelector('.pdfreader .canvas');
    let context=canvas.getContext('2d');
    canvas.height=viewport.height;
    canvas.width=viewport.width;
    page.render({
      canvasContext:context,
      viewport:viewport
    });
    $('.pdfreader .control .pagenum').val(spdf.page);
    $('.pdfreader .control .total_pages').val('/'+spdf.total_pages);
  });
};
const pdf_set_scale=(target)=>{
  if(target>=spdf.min_scale&&target<=spdf.max_scale){
    spdf.scale=target;
    pdf_update();
  }
};
const pdf_page_to=(target)=>{
  if(target>0&&target<=spdf.total_pages){
    spdf.page=target;
    pdf_update();
    return true;
  }
  return false;
};
const pdf_show=(target)=>{
  $('body').css('overflow','hidden');
  $('.pdfreader').css('display','block');
  $('.pdfreader').animate({opacity:1},500);
  loading_on();
  PDFJS.getDocument(target).then((pdf)=>{
    loading_off();
    spdf.src=pdf;
    spdf.total_pages=pdf.pdfInfo.numPages;
    spdf.scale=2;
    pdf_page_to(1);
  });
};
const pdf_hide=()=>{
  $('.pdfreader').animate({opacity:0},500);
  setTimeout(()=>{
    $('.pdfreader').css('display','none');
    $('body').css('overflow','scroll');
  },520 );
};
const msgbox_show=(msg)=>{
  let msgbox=$('#main .msgbox');
  $('#main .msgbox span').html(msg);
  msgbox.css({
    'left':($(window).width()-msgbox.width())/2,
    'top':($(window).height()-msgbox.height())/2,
    'display':'block'
  });
  msgbox.animate({opacity:1},500);
  setTimeout(()=>{
    msgbox.animate({opacity:0},500);
    setTimeout(()=>{
      msgbox.css('display','none');
    },500);
  },1000);
};
const show_rigthmenu=(pos)=>{
  $('#main .rightmenu').css('display','block');
  $('#main .rightmenu').css({
      'top':pos.top+50,
      'left':pos.left+50
  });
};
const hide_rigthmenu=()=>{
  $('.rightmenu').css('display','none');
};
const show_editor=(target,filename)=>{
  $('.tools .editor .title').val(filename);
  edit_get(target);
  $('.tools .editor').css('display','block');
  $('.tools .editor').animate({opacity:1},500);
};
const hide_editor=()=>{
  $('.tools .editor').animate({opacity:0},500);
  setTimeout(()=>{
    $('.tools .editor').css('display','none');
  },500);
};
const show_picviewer=()=>{
  $('.picture_viewer').css('display','block');
  $('.picture_viewer').animate({opacity:1},500);
};
const hide_picviewer=()=>{
  $('.picture_viewer').animate({opacity:0},500);
  setTimeout(()=>{
    $('.picture_viewer').css('display','none');
  },500);
};
const file_item_click=(elem,select)=>{
  let b=$(elem).attr('iselected');
  if(select!=undefined){
    if((!select||!b)&&(select||b)){
      if(select){
        $(elem).attr('iselected','iselected'); //true
        $(elem).addClass('selected');
        if(!state_select){
          if(cur_selected&&cur_selected!=$(elem)){
            cur_selected.attr('iselected',''); //false
            cur_selected.removeClass('selected');
          }
          cur_selected=$(elem);
        }
        file_detail(curpath+'/'+$(elem).children('span').html());
      }
      else{
        $(elem).attr('iselected',''); //false
        $(elem).removeClass('selected');
        cur_selected=undefined;
      }
    }
  }
  else{
    if(!b){
      $(elem).attr('iselected','iselected'); //true
      $(elem).addClass('selected');
      if(!state_select){
        if(cur_selected&&cur_selected!=$(elem)){
          cur_selected.attr('iselected',''); //false
          cur_selected.removeClass('selected');
        }
        cur_selected=$(elem);
      }
      file_detail(curpath+'/'+$(elem).children('span').html());
    }
    else{
      $(elem).attr('iselected',''); //false
      $(elem).removeClass('selected');
      cur_selected=undefined;
    }
  }
  //
  let name=$(elem).children('span').html()
  let target=curpath+'/'+name;
  $('.btn_download').attr('href',baseurl+'download.do?target='+target);
  $('.btn_download').attr('download',name);
};
const file_item_dblclick=(elem)=>{
  state_select=false;
  if($(elem).css('backgroundImage').includes('dir_fileicon.png')){ // is dir
    path_to(curpath+'/'+$(elem).children('span').html());
  }
  else{
    let name=$(elem).children('span').html();
    // e-book,video,image
    if(name.endsWith('jpg')||name.endsWith('png')||name.endsWith('jpeg')||name.endsWith('bmp')){
      loadImage(baseurl+'fileAccess.do?target='+curpath+'/'+name,
        (src)=>{
          let tmp=$('.tools .picture_viewer .image');
          tmp.attr('src',src);
          tmp.css('margin-top',300-tmp.height()/2);}
      );
      show_picviewer();
    }
    // code file
    else if(name.endsWith('css')||name.endsWith('py')||name.endsWith('html')||name.endsWith('js')||name.endsWith('txt')){
      show_editor(curpath+'/'+name,name);
    }
    // pdf
    else if (name.endsWith('pdf')){
      pdf_show(baseurl+'fileGet.do?target='+curpath+'/'+detail_target.children('span').html());
    }
  }
};
const viewer_item_init=()=>{
  $('#main .overviewer .btn').each((i,elem)=>{
    let state=0;
    $(elem).bind({
      'mouseenter':()=>{
        $(elem).css('background-color','rgba(100,100,255,0.8)');
        state=1;
      },
      'mouseleave':()=>{
        $(elem).css('background-color','rgba(0,0,0,0)');
        state=0;
      },
      'mousedown':()=>{
        $(elem).css('background-color','rgba(80,80,150,1)');
      },
      'mouseup':()=>{
        if(state===0){
          $(elem).css('background-color','rgba(0,0,0,0)');
        }
        else{
          $(elem).css('background-color','rgba(100,100,255,0.8)');
        }
      },
      'click':(e)=>{
        file_item_click(elem);
        e.stopPropagation();
      },
      'dblclick':()=>{
        file_item_dblclick(elem);
      }
    });
  });
};
$('.header .path_back').click(()=>{
  let tmp=curpath.split('/');
  if(tmp.length>2){
    tmp.pop();
    path_to(tmp.join('/'));
  }
  else{

  }
});
$('.header .path_forward').click(()=>{
  let tmp=curpath.split('/');
  let tmp1=max_path.split('/');
    if(tmp.length<tmp1.length&&max_path.startsWith(curpath)){
    tmp.push(tmp1[tmp.length]);
    path_to(tmp.join('/'));
  }
  else{
    max_path=curpath;
  }
});
// action
let state_select=false;
let state_upload=false;
let state_rightmenu=false;
let pdf_scroll_v=false;
$('#main .rightmenu .btn_edit').click((e)=>{
  let filename=cur_selected.children('span').html();
  show_editor(curpath+'/'+filename,filename);
  e.stopPropagation();
  hide_rigthmenu();
});
$('#main .rightmenu .btn_delete').click((e)=>{
  delete_file(curpath+'/'+cur_selected.children('span').html());
  hide_rigthmenu();
  cur_selected=undefined;
  e.stopPropagation();
});
$('.upload_file_select').change((e)=>{
  $('.upload_file_path').val(curpath);
  $('.upload_form').submit();
});
$('.header .btn_select').click(()=>{
  cur_selected=undefined;
  if(state_select){
    state_select=false;
    $('.overviewer .item').each((i,e)=>{
      if($(e).attr('class').includes('selected')){
        $(e).removeClass('selected');
      }
      $(e).attr('iselected',''); //false
    });
  }
  else{
    state_select=true;
    $('.overviewer .item').each((i,e)=>{
      if(!$(e).attr('class').includes('selected')){
        $(e).addClass('selected');
      }
      $(e).attr('iselected','iselected'); //true
    });
  }
});
$('.header .btn_upload').click(()=>{
  $('.upload_file_select').click();
});
$('.filedetail .btn_edit').click(()=>{
  let filename=detail_target.children('span').html();
  show_editor(curpath+'/'+filename,filename);
});
$('.filedetail .btn_download').click(()=>{
  let target=$('.filedetail .location');
  download(target);
});
$('.picture_viewer .btn_close').click(hide_picviewer);
$('.editor .btn_close').click(hide_editor);
$('.editor .textfield').keypress((e)=>{
  if(e.originalEvent.ctrlKey&&e.which==115){ // ctrl + s
    edit_save(curpath+'/'+$('.editor .title').val(),$('.editor .textfield').val());
    e.stopPropagation();
    e.preventDefault();
    return false;
  }
});
$('.pdfreader').scroll((e)=>{
  let tmp=$('.pdfreader');
  if(tmp.scrollTop()+tmp.height()>=tmp[0].scrollHeight){
    if(pdf_page_to(spdf.page+1))
      tmp.scrollTop(1);
  }
  else if(tmp.scrollTop()===0){
    if(pdf_page_to(spdf.page-1))
      tmp.scrollTop(tmp[0].scrollHeight-tmp.height()-10);
  }
});
$('.pdfreader .pagenum').keypress((e)=>{
  if(e.which===13){
    if(pdf_page_to(parseInt($('.pdfreader .control .pagenum').val())))
      $('.pdfreader').scrollTop(1);
  }
});
$('.pdfreader .control .btn_scale_dec').click(()=>{
  let tmp=spdf.scale-0.5;
  if(tmp>=spdf.min_scale&&tmp<=spdf.max_scale){
    spdf.scale=tmp;
    pdf_update();
  }
});
$('.pdfreader .control .btn_scale_inc').click(()=>{
  let tmp=spdf.scale+0.5;
  if(tmp>=spdf.min_scale&&tmp<=spdf.max_scale){
    spdf.scale=tmp;
    pdf_update();
  }
});
$('.pdfreader .control .btn_close').click(()=>{
  pdf_hide();
});
// init
PDFJS.workerSrc='static/js/pdf.worker.js';
filetree_open($('.root_path').val(),$('.filetree'));
$('.picture_viewer').css('left',($(window).width()-800)/2);
$('.picture_viewer').css('top',($(window).height()-600)/2);
$('.editor').css('left',($(window).width()-800)/2);
$('.editor').css('top',($(window).height()-600)/2);
$('.loading').css('left',($(window).width()-30)/2);
$('.loading').css('top',($(window).height()-40)/2);
$('body').click(()=>{
  if(state_rightmenu){
    hide_rigthmenu();
    state_rightmenu=false;
  }
  if(cur_selected){
    file_item_click(cur_selected,false);
  }
});
document.oncontextmenu=(e)=>{
  let elem=$(e.target);
  if(elem.attr('class')&&elem.attr('class').includes('file')){
    state_rightmenu=true;
    file_item_click(e.target,true);
    show_rigthmenu($(e.target).offset());
    return false;
  }
};
window.onbeforeunload=()=>{
  $('.header .input_path').val($('.root_path').val());
};
$('.btn').each((i,elem)=>{
  let state=0;
  $(elem).bind({
    'mouseenter':()=>{
      $(elem).css('background-color','rgba(100,100,255,0.8)');
      state=1;
    },
    'mouseleave':()=>{
      $(elem).css('background-color','rgba(0,0,0,0)');
      state=0;
    },
    'mousedown':()=>{
      $(elem).css('background-color','rgba(80,80,150,1)');
    },
    'mouseup':()=>{
      if(state===0){
        $(elem).css('background-color','rgba(0,0,0,0)');
      }
      else{
        $(elem).css('background-color','rgba(100,100,255,0.8)');
      }
    }
  });
});
$('#main .rightmenu .item').each((i,elem)=>{
  let state=0;
  $(elem).bind({
    'mouseenter':()=>{
      $(elem).css('background-color','rgba(100,100,255,0.8)');
      state=1;
    },
    'mouseleave':()=>{
      $(elem).css('background-color','rgba(0,0,0,0)');
      state=0;
    },
    'mousedown':()=>{
      $(elem).css('background-color','rgba(80,80,150,1)');
    },
    'mouseup':()=>{
      if(state===0){
        $(elem).css('background-color','rgba(0,0,0,0)');
      }
      else{
        $(elem).css('background-color','rgba(100,100,255,0.8)');
      }
    }
  });
});
$('#main .overviewer .btn').each((i,elem)=>{
  $(elem).bind({
    'click':(e)=>{
      file_item_click(elem);
      e.stopPropagation();
    },
    'dblclick':()=>{
      file_item_dblclick(elem);
    }
  });
});
