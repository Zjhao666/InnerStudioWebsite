

let docViewContainer=$('#Documents .Fileview .content');
let docItemSelected,docCurPath;

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
const readDir=(target,callback)=>{
  if(!target) target='';
  $.get({
    url:global_host+'document/open?target='+target,
    dataType:'JSON',
    success:(rep)=>{
      if(rep.statuscode==200&&rep.data.length>0){
        // group sort
        let headnode=new Headnode(),
          dir_c=0,pdf_c=0,file_c=0;
        rep.data.forEach((item)=>{
          if(item.isdir){
            headnode.insNode(dir_c-1,`<div class='item file_dir'><span>`+item.name+`</span></div>`);
            dir_c++;
            pdf_c++;
            file_c++;
          }
          else if(item.name.endsWith('.pdf')){
            headnode.insNode(pdf_c-1,`<div class='item file_pdf'><span>`+item.name+`</span></div>`);
            pdf_c++;
            file_c++;
          }
          else{
            headnode.insNode(file_c-1,`<div class='item file_file'><span>`+item.name+`</span></div>`);
            file_c++;
          }
        });
        docViewContainer.html(headnode.lnodeToArray().join(''));
        // bind event for each item
        overviewBindAction();
        // update path
        docCurPath=rep.curpath;
        $('#Documents .Fileview .controller .input_path').val(docCurPath);
        // update maxPath
        if(urlToArray(docMaxPath).length<urlToArray(docCurPath).length||!docMaxPath.includes(docCurPath))
          docMaxPath=docCurPath;
        if(callback) callback(docCurPath);
      }
      else{
        // notify user target path is invalid
        console.log(rep.description);
      }
    }
  });
}
const docTreeOpenTarget=(target,elem)=>{
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
              docTreeOpenTarget(basepath+'/'+name.html(),dir);
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
  if(!target) target='';
  $.get({
    url:global_host+'document/open?target='+target,
    dataType:'JSON',
    success:(rep)=>{
      if(rep.statuscode==200&&rep.data.length>0){
        let html='';
        rep.data.forEach((item,i)=>{
          if(item.isdir) {
            html+='<div class="dir"><span>'+item.name+'</span></div>';
          }
          else{
            html+='<div class="file"><span>'+item.name+'</span></div>';
          }
        });
        $(elem).append($(html));
        actionBind(rep.curpath,elem);
      }
      else{
        // notify user target path is invalid
        console.log('target path is invalid');
      }
    }
  });
};
const docViewOpenTarget=(e)=>{
  let filename=$(e.target).children('span').html(),
      base=docCurPath+(docCurPath.endsWith('/')?'':'/'),
      identi=$(e.target).attr('class');
  if(identi.includes('file_dir')){
    readDir(base+filename);
  }
  else if(identi.includes('file_pdf')){
    pdfReadPage(base+filename,1);
  }
};
const overviewBindAction=()=>$('#Documents .Fileview .content .item').each((i,elem)=>{
  let target=$(elem),
      hovered=false;
  target.bind({
    'mousedown':()=>{
      target.css('background-color','rgb(120,50,220)');
    },
    'mouseup':()=>{
      if(hovered){
        target.css('background-color','rgb(150,100,255)');
      }
      else{
        target.css('background-color','rgba(0,0,0,0)');
      }
    },
    'mouseenter':()=>{
      hovered=true;
      target.css('background-color','rgb(150,100,255)');
    },
    'mouseleave':()=>{
      hovered=false;
      target.css('background-color','rgba(0,0,0,0)');
    },
    'click':(e)=>{
      // 1.behavior
      if(docItemSelected&&docItemSelected!==target){
        docItemSelected[0].classList.remove('selected');
        docItemSelected.children('span').css({
          whiteSpace:'nowrap',
          height:15,
          zIndex:0
        });
      }
      target[0].classList.add('selected');
      target.children('span').css({
        whiteSpace:'normal',
        height:'auto',
        zIndex:1000
      });
      docItemSelected=target;
    },
    'dblclick':(e)=>docViewOpenTarget(e)
  });
});

readDir('',(basepath)=>{
  let target=$('#Documents .Filetree .dir'),
      name=target.children('span'),
      folded=false,loaded=false;
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
        docTreeOpenTarget(basepath,target);
      }
    },
    'dblclick':()=>{
      readDir(basepath);
      if(folded) name.click();
    }
  });
  name.click();
});
// controller behavior
$('#Documents .Fileview .controller .item').each((i,elem)=>{
  let target=$(elem),
      hovered=false;
  target.bind({
    'mousedown':()=>{
      target.css('background-color','rgba(80,120,220,0.8)');
    },
    'mouseup':()=>{
      if(hovered){
        target.css('background-color','rgba(80,160,220,0.8)');
      }
      else{
        target.css('background-color','rgba(0,0,0,0)');
      }
    },
    'mouseenter':()=>{
      hovered=true;
      target.css('background-color','rgba(80,160,220,0.8)');
    },
    'mouseleave':()=>{
      hovered=false;
      target.css('background-color','rgba(0,0,0,0)');
    }
  });
});
// controller back&forward
let docMaxPath='';
$('#Documents .Fileview .controller .path_back').click(()=>{
  let cur=urlToArray($('#Documents .Fileview .controller .input_path').val());
  // access controll
  if(cur.length>2){
    cur.pop();
    readDir('/'+cur.join('/'));
  }
});
$('#Documents .Fileview .controller .path_forward').click(()=>{
  let cur=urlToArray($('#Documents .Fileview .controller .input_path').val()),
      tmp=urlToArray(docMaxPath);
  if(cur.length<tmp.length){
    cur.push(tmp[cur.length]);
    readDir('/'+cur.join('/'));
  }
});
