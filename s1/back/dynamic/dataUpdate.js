
let express=require('express'),
    dbAccess=require('./lib/dbAccess'),
    bodyParser=require('body-parser'),
    util=require('util'),
    urlencodedParser=bodyParser.urlencoded({extended:false});
let app=express();
app.post('/trade',urlencodedParser,(req,rep)=>{
  try{
    let account=parseInt(req.body.account),
        type=req.body.type.toString(),
        tradeVariety=req.body.tradeVariety.toString(),
        price=parseFloat(req.body.price),
        stopLoss=parseFloat(req.body.stopLoss),
        profit=parseFloat(req.body.profit),
        charge=parseFloat(req.body.charge),
        inventoryFee=parseFloat(req.body.inventoryFee),
        totalProfit=parseFloat(req.body.totalProfit);
    let sql=`insert into Trade(account,type,tradeVariety,price,stopLoss,profit,charge,inventoryFee,totalProfit) values(
      `+account+`,"`+type+`","`+tradeVariety+`",`+price+`,`+stopLoss+`,`+profit+`,`+charge+`,`+inventoryFee+`,`+totalProfit+`);`;
    dbAccess.execute(sql,(err,rows)=>{
      if(err) rep.end(JSON.stringify({statuscode:202,description:'数据库操作失败',errinfo:util.inspect(err)}));
      else rep.end(JSON.stringify({statuscode:200}));
    });
  }catch(err){
    rep.end(JSON.stringify({statuscode:201,description:'数据类型不正确',errinfo:util.inspect(err)}));
  }
});
app.post('/tradeHistory',urlencodedParser,(req,rep)=>{
  try{
    let account=parseInt(req.body.account),
        type=req.body.type.toString(),
        tradeNum=parseFloat(req.body.tradeNum),
        tradeVariety=req.body.tradeVariety.toString(),
        price=parseFloat(req.body.price),
        stopLoss=parseFloat(req.body.stopLoss),
        profit=parseFloat(req.body.profit),
        charge=parseFloat(req.body.charge),
        flatTime=req.body.flatTime.toString();
    let sql=`insert into tradeHistory(account,type,tradeNum,tradeVariety,price,stopLoss,profit,charge,flatTime) values(
      `+account+`,"`+type+`",`+tradeNum+`,"`+tradeVariety+`",`+price+`,`+stopLoss+`,`+profit+`,`+charge+`,"`+flatTime+`");`;
    dbAccess.execute(sql,(err,rows)=>{
      if(err) rep.end(JSON.stringify({statuscode:202,description:'数据库操作失败',errinfo:util.inspect(err)}));
      else rep.end(JSON.stringify({statuscode:200}));
    });
  }catch(err){
    rep.end(JSON.stringify({statuscode:201,description:'数据类型不正确',errinfo:util.inspect(err)}));
  }
});
app.post('/account',urlencodedParser,(req,rep)=>{
  try{
    let account=req.body.account.toString(),
        password=req.body.password.toString(),
        phone=req.body.toString();
    let sql=`insert into Account(account,password,phone) values("`+account+`","`+password+`","`+phone`")`;
    dbAccess.execute(sql,(err,rows)=>{
      if(err) rep.end(JSON.stringify({statuscode:202,description:'数据库操作失败',errinfo:util.inspect(err)}));
      else rep.end(JSON.stringify({statuscode:200}));
    })
  }catch(err){
    rep.end(JSON.stringify({statuscode:201,description:'数据类型不正确',errinfo:util.inspect(err)}));
  }
});
module.exports=app;
