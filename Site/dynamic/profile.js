
let express=require('express'),
    util=require('util'),
    dbAccess=require('./lib/dbAccess');

let app=express();

app.get('/getProfile',(err,rows)=>{
  if(!req.allowed){
    let account=req.query.account;
    if(undefined==account){
      rep.end(JSON.stringify({statuscode:201,description:'account field is null'}));return;
    }
    dbAccess.execute('select * from Member where account='+account,(err,rows)=>{
      if(err){
        rep.end(JSON.stringify({statuscode:1,errinfo:util.inspect(err)}));
        console.log(err);return;
      }
      else rep.end(JSON.stringify({statuscode:200,data:rows}));
    });
  }
});

module.exports=app;
