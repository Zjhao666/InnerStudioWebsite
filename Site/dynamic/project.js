
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
  if(allowed){

  }
});
module.exports=app;
