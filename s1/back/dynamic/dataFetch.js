
let express=require('express'),
    util=require('util'),
    dbAccess=require('./lib/dbAccess');

let app=express();

app.get('/accountList',(req,rep)=>{
  // 余额 USD净值 已用预付款 可用预付款 预付款比例 总获利
  dbAccess.execute('select account,rest,usd,used,valiable,percentage,totalProfit from Account',(err,rows)=>{
    if(err){
      rep.end(JSON.stringify({statuscode:201,description:'failed to operate database',errinfo:util.inspect(err)}));
      console.log(err);return;
    }
    else rep.end(JSON.stringify({statuscode:200,data:rows}));
  });
});
app.get('/accountInfo',(req,rep)=>{
  let account=req.query.account;
  if(account.length==0){
    rep.end(JSON.stringify({statuscode:202,description:'field account is undefined'}));
    return
  }
  dbAccess.execute('select rest,usd,used,valiable,percentage,totalProfit from Account where account="'+account+'"',(err,rows)=>{
    if(err){
      rep.end(JSON.stringify({statuscode:201,description:'failed to operate database',errinfo:util.inspect(err)}));
      console.log(err);
    }
    else rep.end(JSON.stringify({statuscode:200,data:rows[0]}));
  });
});
app.get('/accountHistory',(req,rep)=>{
  let account=req.query.account;
  if(account.length==0){
    rep.end(JSON.stringify({statuscode:202,description:'field account is undefined'}));
    return
  }
  dbAccess.execute('select rest,time from Account where account="'+account+'"',(err,rows)=>{
    if(err){
      rep.end(JSON.stringify({statuscode:201,description:'failed to operate database',errinfo:util.inspect(err)}));
      console.log(err);
    }
    else rep.end(JSON.stringify({statuscode:200,data:rows}));
  });
});
app.get('/profitStatisics',(req,rep)=>{
  let account=req.query.account;
  if(account.length==0){
    rep.end(JSON.stringify({statuscode:202,description:'field account is undefined'}));return;
  }
  // dbAccess.execute('select actualProfit from TradeHistory where account="'+account+'"');
});
module.exports=app;
