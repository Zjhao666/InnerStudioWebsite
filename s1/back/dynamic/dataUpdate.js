
let express=require('express'),
    dbAccess=require('./lib/dbAccess'),
    bodyParser=require('body-parser'),
    util=require('util'),
    urlencodedParser=bodyParser.urlencoded({extended:false});

let app=express();
app.post('/',(req,rep)=>{
  let content='';
  req.setEncoding('utf8');
  req.on('data',(chunk)=>content+=chunk);
  req.on('end',()=>{
    try{
      const update=()=>{
        let sql='';
        switch(info.action){
        case 0:// 账户=账户1&action=0&订单=订单1&开仓时间=开仓时间1&类型=类型1&手数=手数1&交易种类=交易种类1&开仓价格=开仓价格1&止损=止损1&止盈获利=止盈获利1&实时价格=实时价格1&库存费=库存费1&实际获利=实际获利1
          sql=`insert into Trade(account,dingDan,openTime,type,tradeNum,tradeVariety,openPrice,stopLoss,zyProfit,realPrice,inventoryFee,actualProfit) values(
            '`+info.account+`',
            '`+data['订单']+`',
            '`+data['开仓时间']+`',
            '`+data['类型']+`',
            '`+data['手数']+`',
            '`+data['交易种类']+`',
            '`+data['开仓价格']+`',
            '`+data['止损']+`',
            '`+data['止盈获利']+`',
            '`+data['实时价格']+`',
            '`+data['库存费']+`',
            '`+data['实际获利']+`')`
          break;
        case 1:// 账户=账户1&action=1&订单=订单1&开仓时间=开仓时间1&类型=类型1&手数=手数1&交易种类=交易种类1&开仓价格=开仓价格1&止损=止损1&止盈获利=止盈获利1&平仓时间=平仓时间1&平仓价格=平仓价格1&库存费=库存费1&实际获利=实际获利1
          sql=`insert into TradeHistory(account,dingDan,openTime,type,tradeNum,tradeVariety,openPrice,stopLoss,zyProfit,flatTime,flatPrice,inventoryFee,actualProfit) values(
            '`+info.account+`',
            '`+data['订单']+`',
            '`+data['开仓时间']+`',
            '`+data['类型']+`',
            '`+data['手数']+`',
            '`+data['交易种类']+`',
            '`+data['开仓价格']+`',
            '`+data['止损']+`',
            '`+data['止盈获利']+`',
            '`+data['平仓时间']+`',
            '`+data['平仓价格']+`',
            '`+data['库存费']+`',
            '`+data['实际获利']+`')`;
          break;
        case 2:// 账户=账户1&action=2&总获利=总获利1
          sql=`update Account set totalProfit="`+data['总获利']+`" where account="`+info.account+`"`;
          break;
        case 3:// 账户=账户1&action=2&余额&USD净值&已用预付款&可用预付款&预付款比例
          sql=`update Account set
            rest="`+data['余额']+`",
            usd="`+data['USD净值']+`",
            used="`+data['已用预付款']+`",
            valiable="`+data['可用预付款']+`",
            percentage="`+data['预付款比例']+`" where account="`+info.account+`"`;
          break;
        }
        dbAccess.execute(sql,(err,rows)=>{
          if(err){
            rep.end(JSON.stringify({statuscode:203,description:'数据库操作异常',errinfo:util.inspect(err)}));
            console.log(err);return;
          }
          else rep.end(JSON.stringify({statuscode:200}));
        });
      }
      // resovle
      let tmp=content.split('&'),info,data={},sql;
      info={
        account:tmp[0].substring(tmp[0].indexOf('=')+1),
        action:parseInt(tmp[1].substring(tmp[1].indexOf('=')+1)),
      };
      if(info.action==3){
        let beNumber=false,ascii,lists=[],start,value;
        for(let i=0,limit=tmp[2].length;i<limit;i++){
          ascii=tmp[2].charCodeAt(i);
          if(ascii>=48&&ascii<=57||ascii==46){// be number
            if(!beNumber){
              beNumber=true;
              start=i;
            }
          }
          else if(beNumber){ // get number
            beNumber=false;
            lists.push(tmp[2].substring(start,i));
          }
        }
        if(lists.length!=5){
          rep.end(JSON.stringify({statuscode:205,description:'数据项不符合'}));
          return;
        }
        data={
          '余额':lists[0],
          'USD净值':lists[1],
          '已用预付款':lists[2],
          '可用预付款':lists[3],
          '预付款比例':lists[4],
        };
      }
      else{
        for(let i=2,limit=tmp.length;i<limit;i++){
          let [key,value]=tmp[i].split('=');
          data[key]=value;
        }
      }
      if(tmp.length<3){
        rep.end(JSON.stringify({statuscode:201,description:'数据格式不正确'}));
        console.log(err);return;
      }
      if(tmp.action>3||tmp.action<0){
        rep.end(JSON.stringify({statuscode:202,description:'无效action值'}));
        console.log(err);return;
      }
      // query for account
      dbAccess.execute('select account from Account where account="'+info.account+'"',(err,rows)=>{
        if(err){
          rep.end(JSON.stringify({statuscode:203,description:'查询账户失败',errinfo:util.inspect(err)}));
          console.log(err);return;
        }
        else if(rows.length==0){
          dbAccess.execute('insert into Account(account) values("'+info.account+'")',(err,rows)=>{
            if(err){
              rep.end(JSON.stringify({statuscode:203,description:'创建账户失败',errinfo:util.inspect(err)}));
              console.log(err);return;
            }
            update();
          });
        }
        else update();
      });
    }catch(err){
      rep.end(JSON.stringify({statuscode:201,description:'',errinfo:util.inspect(err)}));
      console.log(err);
    }
  });
});

module.exports=app;
