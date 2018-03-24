
let chatbox=$('#Members .ChatBox .content');
let ws=new WebSocket('ws://'+window.location.host+'/chat');
ws.onopen=()=>{
  setTimeout(()=>ws.send(JSON.stringify({type:'heart',src:window.localStorage.memid,cookie:$.cookie('MACookie')})),500);
  ws.send(JSON.stringify({type:'reqMember',cookie:$.cookie('MACookie')}));
}
ws.onmessage=(evt)=>{
  let pack=JSON.parse(evt.data);
  if(pack.type=='updMember'){
    $('#Members .MemberList .item').each((i,elem)=>{
      if($(elem).attr('memid')==pack.tar){
        let kl=$(elem)[0].classList;
        if(pack.data&&kl.contains('offline')) kl.remove('offline');
        if(!pack.data&&!kl.contains('offline')) kl.add('offline');
      }
    });
  }
  else if(pack.type=='reqMember'){
    let html='';
    for(let item of pack.data){
      if(item.memid!=window.localStorage.memid){
        let headimg='img/defaultHeadimg.png';
        if(item.headimg) headimg=item.headimg;
        html+=`<div class='item offline' memid=`+item.memid+`>
          <img class='headimg' src='`+headimg+`'>
          <a class='account'>`+item.account+`</a>
        </div>`;
      }
    }
    $('#Members .MemberList').html(html);
    // memberItemActionBind
    $('#Members .MemberList .item').each((i,elem)=>{
      let mask;
      $(elem).bind({
        mouseenter:()=>{
          if(mask) mask.remove();
          mask=$(`<a style='
          display:block;
          position:absolute;
          height:30px;width:100%;
          left:-100%;top:0px;
          background:rgba(100,80,200,0.6);
          '></a>`);
          mask.appendTo(elem);
          mask.animate({left:0},300);
        },
        mouseleave:()=>mask.animate({left:'100%'},300),
        mousedown:()=>mask.css('background-color','rgba(100,80,160,1)'),
        mouseup:()=>mask.css('background-color','rgba(100,80,200,0.6)'),
        click:()=>{
          chatTarget=$(elem).attr('memid');
          inputfield.attr('placeholder','to '+$(elem).find('.account').html()+'...');
        }
      });
    });
  }
  else if(pack.type=='sendMsg'){
    chatbox.append(`<div class='item'>
      <img class='headimg' src='img/defaultHeadimg.png'>
      <div class='message'><span>`+pack.data+`</span></div>
    </div>`);
  }
}
// send
let inputfield=$('#Members .ChatBox .inputfield'),chatTarget;
inputfield.keypress((e)=>{
  if(e.which==13&&inputfield.val().length>0){
    chatbox.append(`<div class='item rightitem'>
      <img class='headimg' src='img/defaultHeadimg.png'>
      <div class='message'><span>`+inputfield.val()+`</span></div>
    </div>`);
    ws.send(JSON.stringify({
      type:'sendMsg',status:'',src:window.localStorage.memid,tar:chatTarget,cookie:$.cookie('MACookie'),data:inputfield.val()
    }))
    inputfield.val('');
    e.stopPropagation();
    return false;
  }
});
inputfield.bind('input propertychange','textarea',()=>{
  inputfield.css('height',20);
  inputfield.css('height',inputfield[0].scrollHeight);
});


const chatboxAddItems=(msgs)=>{
  for(let item of msgs){
    let pos='';
    if(item.source==window.localStorage.memid) pos='rightitem';
    chatbox.append(`<div class='item `+pos+`'>
      <img class='headimg' src='img/defaultHeadimg.png'>
      <div class='message'><span>`+item.message+`</span></div>
    </div>`);
  }
};
const getOldmsg=()=>$.get({
  url:global_host+'member/getOldmsg?',
  dataType:'JSON',
  success:(rep)=>{
    if(rep.statuscode==200) chatboxAddItems(rep.data);
    else if(rep.statuscode==201) console.log('no old msg');// no old msg
    else notify(rep.description);// error
  }
});
const getNewmsg=()=>$.get({
  url:global_host+'member/getNewmsg?',
  dataType:'JSON',
  success:(rep)=>{
    if(rep.statuscode==200) chatboxAddItems(rep.data);
    else if(rep.statuscode==201) console.log('no new msg');// no old msg
    else notify(rep.description);// error
  },
  error:(err)=>{
    if(err) console.log(err);
  }
});
const getTargetProfile=(target)=>{

};

getOldmsg();
getNewmsg();

$(window).on('beforeunload',()=>{
  ws.close();
  getOldmsg();
  getNewmsg();
});
