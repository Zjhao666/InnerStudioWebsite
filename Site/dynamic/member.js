
let express=require('express'),
    dbAccess=require('./lib/dbAccess.js'),
    util=require('util'),
    sillyDate=require('silly-datetime'),
    bodyParser=require('body-parser'),
    urlencodedParser=bodyParser.urlencoded({extended:false});

let app=express();
app.get('/getMembers',(req,rep)=>{
  if(req.allowed){
    dbAccess.execute('select memid,pertag,account,headimg from Member',(err,ret)=>{
      if(err){
        rep.end(JSON.stringify({statuscode:201,description:util.inspect(err)}));
        console.log(err);
      }
      else rep.end(JSON.stringify({statuscode:200,data:ret}));
    });
  }
});
app.get('/getOldmsg',(req,rep)=>{
  if(req.allowed){
    dbAccess.execute('select source,target,message,timestamp from Oldmsg where source='+req.session.memid+' or target='+mmid,(err,ret)=>{
      if(err){
        rep.end(JSON.stringify({statuscode:201,description:util.inspect(err)}));
        console.log(err);
      }
      else rep.end(JSON.stringify({statuscode:200,data:ret}));
    });
  }
});
app.get('/getNewmsg',(req,rep)=>{
  if(req.allowed){
    dbAccess.execute('select source,target,message,timestamp from Newmsg where source='+req.session.memid+' or target='+mmid,(err,ret)=>{
      if(err){
        rep.end(JSON.stringify({statuscode:202,description:util.inspect(err)}));
        console.log(err);
      }
      else rep.end(JSON.stringify({statuscode:200,data:ret}));
    });
  }
});

let context=[];
app.chat=(ws,req)=>{
  ws.on('message',(msg)=>{
    if(msg.startsWith('[:MA:]')){// regis
      let memid=msg.replace('[:MA:]','');
      // broadcast online
      for(let key in context){
        if(context[key]){
          ws.send('[:MA:]'+key+'[:MA:]1');
          context[key].send('[:MA:]'+memid+'[:MA:]1');
        }
      }
      // add member
      context[memid]=ws;
      ws.send('[:MA:]'+memid+'[:MA:]1');
    }
    else{// conversion
      let [source,target,message]=msg.split('[:MA:]');// missing cookie
      if(source==req.session.memid){
        if(context[target]){
          context[target].send(msg);
          // save msg into oldmsg
          console.log('save msg into oldmsg:'+msg);
        }
        else{
          // save msg into newmsg
          console.log('save msg into newmsg:'+msg);
        }
      }
    }
  });
  ws.on('close',()=>{// unregis
    for(let key in context){
      if(context[key]==ws){
        context[key]=undefined;
        // broadcast offline
        for(let akey in context){
          if(akey!=key) context[akey].send('[:MA:]'+key+'[:MA:]0');
        }
        break;
      }
    }
  });
};

module.exports=app;
