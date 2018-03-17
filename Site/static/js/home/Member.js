/*
// let ac=localStorage.getItem('ac'),pw=localStorage.getItem('pw');
let ac='1',pw='1';
let ws=new WebSocket('ws://127.0.0.1:9001/chat');
ws.onopen=function(evt){
  // connect check
};
ws.onmessage=(evt)=>{
  // new message received
  let data=JSON.parse(evt.data);
  if(data.type=='*'){
    let n=data.content.n,
        e=data.content.e;
    ws.send(JSON.stringify({
      type:'*',
      content:RSA.encrypt(ac+'&'+pw,n,e)
    }));
  }
  else if(data.type=='/'){
    if(data.content.statuscode==200){
      console.log('Validate successfully');
      ws.send(JSON.stringify({
        type:'?',
        target:2
      }));
    }
    else{
      console.log('Validate failed');
    }
  }
  else if(data.type=='+'){
    console.log(data.param,data.content);
  }
  else if(data.type=='?'){
    console.log(data.content);
  }
};
ws.onclose=(evt)=>{

};
ws.onerror=(evt)=>{

};

$(window).on('beforeunload',()=>{
  ws.close();
});

*/
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
  $('#Members .item').each((i,elem)=>{
    let mask;
    $(elem).bind({
      mouseenter:()=>{
        if(mask) mask.remove();
        mask=$(`<a style='
        display:block;
        position:absolute;
        height:30px;width:0px;
        left:0px;top:0px;
        background:rgba(100,80,200,0.6);
        '></a>`);
        mask.appendTo(elem);
        mask.animate({width:210},300);
      },
      mouseleave:()=>{
        mask.animate({left:210},300);
      },
      mousedown:()=>{
        mask.css('background-color','rgba(100,80,160,1)');
      },
      mouseup:()=>{
        mask.css('background-color','rgba(100,80,200,0.6)');
      }
    });
  });

getMemberList();
