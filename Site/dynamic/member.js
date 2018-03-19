
let express=require('express'),
    dbAccess=require('./lib/dbAccess.js'),
    util=require('util'),
    sillyDate=require('silly-datetime'),
    bodyParser=require('body-parser'),
    urlencodedParser=bodyParser.urlencoded({extended:false});

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
app.get('/getNewmsg',(req,rep)=>{
  let mmid=req.query.user;
  dbAccess.execute('select source,target,message,timestamp from Newmsg where source='+mmid+' or target='+mmid,(err,ret)=>{
    if(err) rep.end(JSON.stringify({statuscode:202,description:util.inspect(err)}));
    else if(ret.length==0) rep.end(JSON.stringify({statuscode:201}));
    else rep.end(JSON.stringify({statuscode:200,data:ret}));
  });
});
app.post('/sendMsg',urlencodedParser,(req,rep)=>{
  if(req.body.source&&req.body.target&&req.body.message){
    let source=parseInt(req.body.source),target=parseInt(req.body.target),message=req.body.message.toString();
    let timestamp=sillyDate.format(new Date(),'YYYY-MM-DD-HH-mm-ss');
    dbAccess.execute('select isOnline from Member where target='+target,(err,rows)=>{
      if(err) rep.end(JSON.stringify({statuscode:202,description:util.inspect(err)}));
      else if(rows.length==0) req.end(JSON.stringify({statuscode:201,description:'target member does not exist'}));
      else if(rows[0].isOnline){
        // dma
        // save message to Oldmsg
        dbAccess.execute(`insert into Oldmsg(source,target,timestamp) values(`+source+`,`+target+`,'`+message+`','`+timestamp+`')`,(err,rows)=>{

        });
      }
      else{
        // save message to Newmsg
        dbAccess.execute(`insert into Oldmsg(source,target,timestamp) values(`+source+`,`+target+`,'`+message+`','`+timestamp+`')`,(err,rows)=>{

        });
      }
    });
    dbAccess.execute('insert into Newmsg')
  }
  else{

  }
});
module.exports=app;
