
let express=require('express'),
    util=require('util'),
    dbAccess=require('./lib/dbAccess');
let app=express();

app.get('/getPlans',(req,rep)=>{
  if(req.allowed){
    let beCompleted=req.query.beCompleted;
    if(!beCompleted){
      rep.end(JSON.stringify({statuscode:203,description:'beCompleted feild is null'}));return;
    }
    if(beCompleted=='0') beCompleted=false;
    else if(beCompleted=='1') beCompleted=true;
    else{
      rep.end(JSON.stringify({statuscode:202,description:'beCompleted value is illegal'}));return;
    }
    dbAccess.execute('select planid,regisTime,deadLine,title,description,stageNum from Plan where completed='+beCompleted,(err,rows)=>{
      if(err){
        rep.end(JSON.stringify({statuscode:201,errinfo:util.inspect(err)}));
        console.log(err);
      }else rep.end(JSON.stringify({statuscode:200,data:rows}));
    });
  }
});
app.get('/getStages',(req,rep)=>{
  if(req.allowed){
    let planid=req.query.target;
    if(planid.length==0){
      rep.end(JSON.stringify({statuscode:202,description:'plan field is null'}));
      return;
    }
    dbAccess.execute(`select
      PS.psid as psid,
      PS.timestamp as deadLine,
      PS.target as target,
      PS.status as status,
      M.account as account,
      PC.timestamp as commentTime,
      PC.comment as comment
      from
        Planstage as PS left join Plancomment as PC on PS.psid=PC.psid
        left join Member as M on PC.memberid=M.memid
      where PS.planid=`+planid,(err,rows)=>{
      if(err){
        rep.end(JSON.stringify({statuscode:201,errinfo:util.inspect(err)}));
        console.log(err);
      }else{
        let ret=[];
        for(let item of rows){
          if(undefined==ret[item.psid]){
            ret[item.psid]={
              deadLine:item.deadLine,
              status:item.status,
              target:item.target,
              comments:[]
            };
          }
          ret[item.psid].comments.push({
            account:item.account,
            commentTime:item.commentTime,
            comment:item.comment
          });
        }
        rep.end(JSON.stringify({statuscode:200,data:ret}));
      }
    });
  }
});

module.exports=app;
