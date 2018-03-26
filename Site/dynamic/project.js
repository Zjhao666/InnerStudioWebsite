
let express=require('express'),
    util=require('util'),
    dbAccess=require('./lib/dbAccess');
let app=express();

app.get('/getProject',(req,rep)=>{
  if(!req.allowed){
    let prid=req.query.target;
    if(!prid){
      rep.end(JSON.stringify({statuscode:203,description:'account feild is null'}));return;
    }
    dbAccess.execute(`select regisTime,expectedTime,title,description,captain,space,stageNum,completionDegree,activity,member from Project where prid=`+prid,(err,rows)=>{
      if(err){
        rep.end(JSON.stringify({statuscode:202,errinfo:util.inspect(err)}));
        console.log(err);return;
      }
      else{
        let ret={
          regisTime:rows[0].title,
          expectedTime:rows[0].expectedTime,
          title:rows[0].title,
          description:rows[0].description,
          completionDegree:rows[0].completionDegree,
          activity:rows[0].activity,
          captain:rows[0].captain,
          space:rows[0].space,
          stageNum:rows[0].stageNum,
          member:rows[0].member,
          stage:undefined
        };
        dbAccess.execute('select psid,target,timestamp,status from Projectstage where prid='+prid,(err,rows)=>{
          if(err){
            rep.end(JSON.stringify({statuscode:202,errinfo:util.inspect(err)}));
            console.log(err);return;
          }
          else{
            ret.stage=rows;
            let parttern='';
            for(let part of ret.member.split(',')){
              parttern+=' or memid='+part;
            }
            parttern=parttern.replace('or ','');
            dbAccess.execute('select account,headimg from Member where'+parttern,(err,rows)=>{
              if(err){
                rep.end(JSON.stringify({statuscode:202,errinfo:util.inspect(err)}));
                console.log(err);return;
              }
              else{
                ret.member=rows;
                rep.end(JSON.stringify({statuscode:200,data:ret}));
              }
            });
          }
        });
      }
    });
  }
});
app.get('/getProjects',(req,rep)=>{
  if(!req.allowed){
    dbAccess.execute(`
      select
        P.prid,PS.psid,PC.pcid,
        P.regisTime,P.title,P.description,P.captain,P.space,P.expectedTime,P.completionDegree,P.activity,P.member,
        PS.target,PS.timestamp as pstimestamp,PS.status,
        PC.memberid,PC.account,PC.timestamp as pctimestamp,PC.comment
      from
        Project as P left join Projectstage as PS on P.prid=PS.prid left join Projectcomment as PC on PS.psid=PC.psid
      `,(err,rows)=>{
      if(err){
        rep.end(JSON.stringify({statuscode:202,errinfo:util.inspect(err)}));
        console.log(err);return;
      }
      let ret=[];
      for(let item of rows){
        if(undefined==ret[item.prid]){
          ret[item.prid]={
            prid:item.prid,
            title:item.title,
            regisTime:item.regisTime,
            description:item.description,
            captain:item.captain,
            space:item.space,
            expectedTime:item.expectedTime,
            completionDegree:item.completionDegree,
            activity:item.activity,
            member:item.member,
            stage:[]
          };
        }
        if(undefined==ret[item.prid].stage[item.psid]){
          ret[item.prid].stage[item.psid]={
            target:item.target,
            timestamp:item.pstimestamp,
            status:item.status,
            comment:[]
          };
        }
        ret[item.prid].stage[item.psid].comment[item.pcid]={
          memberid:item.memberid,
          account:item.account,
          timestamp:item.pctimestamp,
          content:item.comment
        };
      }
      rep.end(JSON.stringify({statuscode:200,data:ret}));
    });
  }
});
module.exports=app;
