
let chatbox=$('#Members .ChatBox .content');
let ws=new WebSocket('ws://'+window.location.host+'/chat');
ws.onmessage=(evt)=>{
  if(evt.data.startsWith('[:MA:]')){
    // set offline or online
    let [target,state]=evt.data.replace('[:MA:]','').split('[:MA:]');
    $('#Members .MemberList .item').each((i,elem)=>{
      if($(elem).attr('memid')==target){
        let kl=$(elem)[0].classList;
        if(state&&kl.contains('offline')) kl.remove('offline');
        if(!state&&!kl.contains('offline')) kl.add('offline');
      }
    });
  }
  else chatbox.append(`<div class='item'>
    <img class='headimg' src='img/defaultHeadimg.png'>
    <div class='message'><span>`+evt.data.split('[:MA:]')[2]+`</span></div>
  </div>`);
}
ws.onopen=()=>ws.send('[:MA:]'+window.localStorage.memid);
// send
let inputfield=$('#Members .ChatBox .inputfield'),chatTarget;
inputfield.keypress((e)=>{
  if(e.which==13&&inputfield.val().length>0){
    chatbox.append(`<div class='item rightitem'>
      <img class='headimg' src='img/defaultHeadimg.png'>
      <div class='message'><span>`+inputfield.val()+`</span></div>
    </div>`);
    ws.send(window.localStorage.memid+'[:MA:]00000000002[:MA:]'+inputfield.val());
    inputfield.val('');
    e.stopPropagation();
    return false;
  }
});
inputfield.bind('input propertychange','textarea',()=>{
  inputfield.css('height',20);
  inputfield.css('height',inputfield[0].scrollHeight);
});

$(window).on('beforeunload',()=>{
  ws.close();
});

const getMemberList=()=>{
  $.get({
    url:global_host+'member/getMembers',
    dataType:'JSON',
    success:(rep)=>{
      let container=$('#Members .MemberList');
      if(rep.statuscode==200&&rep.data.length>0){
        let html='';
        for(let item of rep.data){
          let headimg='img/defaultHeadimg.png';
          if(item.headimg) headimg=item.headimg;
          html+=`<div class='item offline' memid=`+item.memid+`>
            <img class='headimg' src='`+headimg+`'>
            <a class='account'>`+item.account+`</a>
          </div>`
        }
        container.html(html);
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
            click:()=>chatTarget=$(elem).attr('memid')
          });
        });
      }
      else{
        console.log('request for member list failed');
      }
    }
  })
};
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
  url:global_host+'member/getOldmsg?user='+window.localStorage.memid,
  dataType:'JSON',
  success:(rep)=>{
    if(rep.statuscode==200) chatboxAddItem(rep.data);
    else if(rep.statuscode==201) console.log('no old msg');// no old msg
    else notify(rep.description);// error
  }
});
const getNewmsg=()=>$.get({
  url:global_host+'member/getNewmsg?user='+window.localStorage.memid,
  dataType:'JSON',
  success:(rep)=>{
    if(rep.statuscode==200) chatboxAddItem(rep.data);
    else if(rep.statuscode==201) console.log('no new msg');// no old msg
    else notify(rep.description);// error
  },
  error:(err)=>{
    if(err) console.log(err);
  }
});
const getTargetProfile=(target)=>{

};

getMemberList();
// getOldmsg();
// getNewmsg();

// 1.chat,redius
// 2.get detail
