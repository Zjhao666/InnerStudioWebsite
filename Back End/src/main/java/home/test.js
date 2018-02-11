'use strict';

let request=require('request');
request.post({url:'http://101.200.37.220:8080/InnerStudioWebsite/regis.do',form:{accout:'123',password:'123',nickname:'123',realname:'123'}},
  (err,rep,body)=>{

    if(err){
      console.log('err',err);
    }
    else if(body){
      console.log('body',body);
    }
    else{
      console.log('rep:',rep);
    }
  }
);
// download a atom package:platformio-ide-terminal
// i can't run runner...
