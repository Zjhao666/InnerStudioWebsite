
let express=require('express');
let dbAccess=require('./lib/dbAccess.js');

let app=express();
app.get('/getMembers',(req,rep)=>{
  dbAccess.query('select isOnline,pertag,account,headimg from Member',(err,ret)=>{
    if(err){
      // log
    }
    else rep.end(JSON.stringify({statuscode:200,data:ret}));
  });
});

module.exports=app;
