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
