
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
    else rep.end(JSON.stringify({
      statuscode:200,
      data:rows
    }));
  });
});

module.exports=app;
