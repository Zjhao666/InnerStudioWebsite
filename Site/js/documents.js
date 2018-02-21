
let baseurl='http://localhost:8000/'
let istoken=localStorage.getItem('istoken');

class Lnode{
  constructor(data){
    this.data=data;
    this.pre=undefined;
    this.nxt=undefined;
  }
  link(pre,nxt){
    if(pre){
      this.pre=pre;
    }
    if(nxt){
      this.nxt=nxt;
    }
  }
}
class Headnode{
  constructor(){
    this.headnode=undefined;
    this.lastnode=undefined;
    this.size=0;
  }
  newNode(data){
    let tmp=new Lnode(data);
    if(!this.headnode){
      this.headnode=tmp;
      this.lastnode=tmp;
    }
    else{
      this.lastnode.link(undefined,tmp);
      tmp.link(this.lastnode,undefined);
      this.lastnode=tmp;
    }
    this.size++;
  }
  insNode(index,data){
    if(index==-1){
      if(!this.headnode){
        this.headnode=new Lnode(data);
        this.size++;
      }
      else{
        let newnode=new Lnode(data);
        newnode.link(undefined,this.headnode);
        this.headnode.link(newnode,undefined);
        this.headnode=newnode;
        this.size++;
      }
      return true;
    }
    else if(0<=index&&index<this.size){
      let target=this.headnode,
          newnode=new Lnode(data);
      for(let i=1;i!=index+1;i++)
        target=target.nxt;
      if(target.nxt){
        newnode.link(target,target.nxt);
        target.nxt.link(newnode,undefined);
        target.link(undefined,newnode);
      }
      else{
        newnode.link(target,undefined);
        target.link(undefined,newnode);
      }
      this.size++;
      return true;
    }
    else return false;
  }
  lnodeToArray(){
    if(this.headnode){
      let ret=[],cur=this.headnode;
      ret.push(cur.data);
      while(cur.nxt){
        cur=cur.nxt;
        ret.push(cur.data);
      }
      return ret;
    }
  }
}
const urlToArray=(url)=>{
  let ret=[],tmp='';
  for(let c of url){
    if(c!=='/')
      tmp+=c;
    else if(tmp){
      ret.push(tmp);
      tmp='';
    }
  }
  if(tmp) ret.push(tmp);
  return ret;
};

const readDetail=(target)=>{
  if(target!=$('.filedetail .location')){
    $.get({
      url:baseurl+'documents.do?param=detail&target='+target+'&istoken='+istoken,
      dataType:'JSON',
      success:(rep)=>{
        let detail=rep.detail;
        $('.filedetail .title').html(detail.filename);
        $('.filedetail .location').html(detail.location);
        $('.filedetail .size').html(detail.size);
        $('.filedetail .type').html(detail.type);
      }
    });
  }
};
const readDir=(target)=>{
  if(!target)
    target='';
  $.get({
    url:baseurl+'documents.do?param=dir&target='+target+'&istoken='+istoken,
    dataType:'JSON',
    success:(rep)=>{
      if(rep.statuscode==199){
        console.log(rep.description);
      }
      else{
        let headnode=new Headnode(),
          dir_c=0,pdf_c=0,file_c=0;
        rep.items.forEach((item,i)=>{
          if(item.type==0){
            headnode.insNode(dir_c-1,`<div class='item file_dir'><span>`+item.name+`</span></div>`);
            dir_c++;
            pdf_c++;
            file_c++;
          }
          else if(item.type==1){
            headnode.insNode(pdf_c-1,`<div class='item file_pdf'><span>`+item.name+`</span></div>`);
            pdf_c++;
            file_c++;
          }
          else if(item.type==2){
            headnode.insNode(file_c-1,`<div class='item file_file'><span>`+item.name+`</span></div>`);
            file_c++;
          }
        });
        overviewCurPath=rep.basepath;
        $('#Overview').html(headnode.lnodeToArray().join(''));
        overviewBindAction();
        $('#Navigate .input_path').val(rep.basepath);
        // update maxPath
        if(urlToArray(maxPath).length<urlToArray(overviewCurPath).length||!maxPath.includes(overviewCurPath)){
          maxPath=overviewCurPath;
        }
      }
    }
  });
};
const filetree_open=(target,elem)=>{
  const actionBind=(basepath,baseelem)=>{
    $(baseelem).children('div').each((i,dir)=>{
      let name=$(dir).children('span'),folded=false,loaded=false;
      if($(dir).attr('class').includes('dir')){
        name.bind({
          'click':()=>{
            if(loaded){
              if(folded){
                folded=false;
                $(dir).find('div').css('display','block');
              }
              else{
                folded=true;
                $(dir).find('div').css('display','none');
              }
            }
            else{
              loaded=true;
              filetree_open(basepath+'/'+name.html(),dir);
            }
          },
          'dblclick':()=>{
            readDir(basepath+'/'+name.html());
            name.click();
          }
        });
      }
    });
  }
  $.get({
    url:baseurl+'documents.do?param=dir&target='+target+'&istoken='+istoken,
    dataType:'JSON',
    success:(rep)=>{
      let html='';
      rep.items.forEach((item,i)=>{
        if(item.type==0) {
          html+='<div class="dir"><span>'+item.name+'</span></div>';
        }
        else{
          html+='<div class="file"><span>'+item.name+'</span></div>';
        }
      });
      $(elem).append($(html));
      actionBind(rep.basepath,elem);
    }
  });
};
const pdfReadPage=(target,page)=>{
  $.get({
    url:baseurl+'documents.do?param=pdf&istoken='+istoken+'&target='+target+'&exten='+page,
    dataType:'JSON',
    success:(rep)=>{
      console.log(rep);
    }
  });
};
const openTarget=(e)=>{
  let filename=$(e.target).children('span').html(),
      base=overviewCurPath+(overviewCurPath.endsWith('/')?'':'/'),
      identi=$(e.target).attr('class');
  if(identi.includes('file_dir')){
    readDir(base+filename);
  }
  else if(identi.includes('file_pdf')){
    pdfReadPage(base+filename,1);
  }

};
(function(){
  let target=$('.filetree .dir'),
      name=target.children('span'),
      folded=false,loaded=false,
      basepath='/home/lijingwei/Documents';
  name.html(basepath);
  name.bind({
    'click':()=>{
      if(loaded){
        if(folded){
          folded=false;
          target.find('div').css('display','block');
        }
        else{
          folded=true;
          target.find('div').css('display','none');
        }
      }
      else{
        loaded=true;
        filetree_open(basepath,target);
      }
    },
    'dblclick':()=>{
      readDir(basepath);
      if(folded) name.click();
    }
  });
  name.click();
})();
readDir();

// right menu behavior
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

// overview behavior
let overview_selected,overviewCurPath;
const overviewBindAction=()=>$('#Overview .item').each((i,elem)=>{
  let target=$(elem),
      hovered=false;
  target.bind({
    'mousedown':()=>{
      target.css('background-color','rgb(220,220,220,0.8)');
    },
    'mouseup':()=>{
      if(hovered){
        target.css('background-color','rgba(200,200,200,0.8)');
      }
      else{
        target.css('background-color','rgba(0,0,0,0)');
      }
    },
    'mouseenter':()=>{
      hovered=true;
      target.css('background-color','rgba(200,200,200,0.8)');
    },
    'mouseleave':()=>{
      hovered=false;
      target.css('background-color','rgba(0,0,0,0)');
    },
    'click':(e)=>{
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
      $('#Sidebox .filedetail .thumbnail').css('background-image',target.css('background-image'));
      readDetail(overviewCurPath+(overviewCurPath.endsWith('/')?'':'/')+$(e.target).children('span').html());
    },
    'dblclick':(e)=>openTarget(e)
  });
});

// navigate behavior
$('#Navigate .item').each((i,elem)=>{
  let target=$(elem),
      hovered=false;
  target.bind({
    'mousedown':()=>{
      target.css('background-color','rgba(80,120,220,1)');
    },
    'mouseup':()=>{
      if(hovered){
        target.css('background-color','rgba(80,160,220,1)');
      }
      else{
        target.css('background-color','rgba(0,0,0,0)');
      }
    },
    'mouseenter':()=>{
      hovered=true;
      target.css('background-color','rgba(80,160,220,1)');
    },
    'mouseleave':()=>{
      hovered=false;
      target.css('background-color','rgba(0,0,0,0)');
    }
  });
});

// path back&forward
let maxPath='';
$('#Navigate .path_back').click(()=>{
  let cur=urlToArray($('#Navigate .input_path').val());
  if(cur.length>2){
    cur.pop();
    readDir('/'+cur.join('/'));
  }
});
$('#Navigate .path_forward').click(()=>{
  let cur=urlToArray($('#Navigate .input_path').val()),tmp=urlToArray(maxPath);
  if(cur.length<tmp.length){
    cur.push(tmp[cur.length]);
    readDir('/'+cur.join('/'));
  }
});
