
let express=require('express'),
    dbAccess=require('./lib/dbAccess.js'),
    util=require('util');

let app=express();
app.get('/getMembers',(req,rep)=>{
  dbAccess.execute('select isOnline,pertag,account,headimg from Member',(err,ret)=>{
    if(err) rep.end(JSON.stringify({statuscode:201,description:util.inspect(err)}));
    else rep.end(JSON.stringify({statuscode:200,data:ret}));
  });
});
app.get('/getOldmsg',(req,rep)=>{
  let mmid=req.query.user;
  dbAccess.execute('select source,target,message,timestamp from Oldmsg where source='+mmid+' or target='+mmid,(err,ret)=>{
    if(err) rep.end(JSON.stringify({statuscode:202,description:util.inspect(err)}));
    else if(ret.length==0) rep.end(JSON.stringify({statuscode:201}));
    else rep.end(JSON.stringify({statuscode:200,data:ret}));
  });
});
module.exports=app;
