
let express=require('express'),
    dbAccess=require('./lib/dbAccess.js'),
    util=require('util'),
    sillyDate=require('silly-datetime'),
    bodyParser=require('body-parser'),
    urlencodedParser=bodyParser.urlencoded({extended:false});

let app=express();
app.get('/getOldmsg',(req,rep)=>{
  if(req.allowed){
    dbAccess.execute('select source,target,message,timestamp from Oldmsg where source='+req.session.memid+' or target='+req.session.memid,(err,ret)=>{
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
    dbAccess.execute('select source,target,message,timestamp from Newmsg where source='+req.session.memid+' or target='+req.session.memid,(err,ret)=>{
      if(err){
        rep.end(JSON.stringify({statuscode:202,description:util.inspect(err)}));
        console.log(err);
      }
      else rep.end(JSON.stringify({statuscode:200,data:ret}));
    });
  }
});

let context=[];
const equalString=(a,b)=>{
  a=a.replace(/ /g,'+');
  if(a.length==b.length){
    for(let i=0,limit=a.length;i<limit;i++) if(a[i]!=b[i]) return false;
    return true;
  }
  return false;
}
app.chat=(ws,req)=>{
  // type src tar cookie status data
  let client;
  ws.on('message',(raw)=>{
    let pack=JSON.parse(raw);
    if(equalString(pack.cookie,req.cookies['MACookie'])){
      if(pack.type=='heart'){
        client=pack.src;
        for(let key in context){
          if(context[key]){
            ws.send(JSON.stringify({type:'updMember',tar:key,data:1}));
            context[key].send(JSON.stringify({type:'updMember',tar:pack.src,data:1}));
          }
        }
        context[pack.src]=ws;
      }
      else if(pack.type=='sendMsg'&&pack.src&&pack.tar){
        if(context[pack.tar]){
          context[pack.tar].send(raw);
          dbAccess.execute(`insert into Oldmsg(source,target,message,timestamp) values(
            `+pack.src+`,
            `+pack.tar+`,
            "`+pack.data+`",
            "`+sillyDate.format(new Date(),'YYYY-MM-DD-hh-mm-ss')+`"
          )`,(err,rows)=>{
            if(err) console.log(err);
            else console.log('old message from src: '+pack.src);
          });
        }
        else{
          dbAccess.execute(`insert into Newmsg(source,target,message,timestamp) values(
            `+pack.src+`,
            `+pack.tar+`,
            "`+pack.data+`",
            "`+sillyDate.format(new Date(),'YYYY-MM-DD-hh-mm-ss')+`"
          )`,(err,rows)=>{
            if(err) console.log(err);
            else console.log('new message from src: '+pack.src);
          });
        }
      }
      else if(pack.type='reqMember'){
        dbAccess.execute('select memid,pertag,account,headimg from Member',(err,rows)=>{
          if(err) console.log(err);
          else ws.send(JSON.stringify({type:'reqMember',data:rows}));
        });
      }
    }
  });
  ws.on('close',()=>{
    if(context[client]){
      context[client]=undefined;
      // broadcast offline
      for(let key in context){
        if(context[key])
          context[key].send(JSON.stringify({type:'updMember',tar:client,data:0}));
      }
    }
  });
};

module.exports=app;
