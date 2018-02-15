

// const WebSocket=require('ws');

let appid,
    ws=new WebSocket('ws://127.0.0.1:9001/chat');

let ac='1',pw='1';
ws.onopen=function(evt){
  // connect check
};
ws.onmessage=(evt)=>{
  // new message received
  let data=JSON.parse(evt.data);
  if(data.type=='*'){
    let {n,e}=data.content;
    ws.send(JSON.stringify({
      type:'*',
      content:RSA.encryptAlone(ac+'&'+pw,n,e)
    }));
  }
  else if(data.type=='/'){
    if(data.content.statuscode==200){
      console.log('Validate successfully');

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

setTimeout(()=>{
  ws.send(JSON.stringify({
    type:'?',
    target:2
  }));
},2000);
