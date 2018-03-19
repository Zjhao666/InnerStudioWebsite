
let mmid=1,chatbox=$('#Members .ChatBox .content');
let ws=new WebSocket('ws://localhost:8081/ws/chat');
ws.onmessage=(evt)=>{
  console.log(evt.data);
};
// ws.onclose=(evt)=>{};
// ws.onerror=(evt)=>{};

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
        let tmp='',klass='item',headimg='img/headimg_default.jpg';
        for(let item of rep.data){
          if(!item.isOnline) klass+=' offline';
          if(item.headimg) headimg=item.headimg;
          tmp+=`<div class='`+klass+`'>
            <img class='headimg' src='`+headimg+`'>
            <a class='account'>`+item.account+`</a>
          </div>`
        }
        container.html(tmp);
        memberItemActionBind();
      }
      else{
        console.log('request for member list failed');
      }
    }
  })
};
const memberItemActionBind=()=>
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
      mouseleave:()=>{
        mask.animate({left:'100%'},300);
      },
      mousedown:()=>{
        mask.css('background-color','rgba(100,80,160,1)');
      },
      mouseup:()=>{
        mask.css('background-color','rgba(100,80,200,0.6)');
      }
    });
  });
const chatboxAddItem=(oldmsg)=>{
  for(let item of oldmsg){
    let pos='';
    if(item.source==mmid) pos='rightitem';
    chatbox.append(`<div class='item `+pos+`'>
      <img class='headimg' src='img/defaultHeadimg.png'>
      <div class='message'><span>`+item.message+`</span></div>
    </div>`);
  }
};

let inputfield=$('#Members .ChatBox .inputfield');
inputfield.bind('input propertychange','textarea',()=>{
  inputfield.css('height',20);
  inputfield.css('height',inputfield[0].scrollHeight);
});

getMemberList();
// get old msg
const getOldmsg=()=>$.get({
  url:global_host+'member/getOldmsg?user='+mmid,
  dataType:'JSON',
  success:(rep)=>{
    if(rep.statuscode==200) chatboxAddItem(rep.data);
    else if(rep.statuscode==201) console.log('no old msg');// no old msg
    else notify(rep.description);// error
  }
});
const getNewmsg=()=>$.get({
  url:global_host+'member/getNewmsg?user='+mmid,
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
const sendMsg=(target,msg)=>$.post({
  url:global_host+'member/sendMsg',
  data:{
    source:mmid,
    target:target,
    message:msg
  },
  success:(rep)=>{
    if(rep.statuscode==200){

    }
  }
});
const getTargetProfile=(target)=>{

};
getOldmsg();
getNewmsg();

// 1.chat,redius
// 2.get detail
