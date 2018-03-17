
let express=require('express'),
    fs=require('fs'),
    path=require('path');

let app=express();

let rootPath='/home/lijingwei';

app.get('/open',(req,rep)=>{
  let target=req.query.target;
  console.log(target);
  if(!target) target=rootPath;
  if(!fs.existsSync(target)||!target.startsWith(rootPath)){
    rep.end(JSON.stringify({statuscode:201,description:'invalid path'}));
  }
  else{
    let filelist=[];
    for(let filename of fs.readdirSync(target))
      filelist.push({name:filename,isdir:fs.statSync(path.join(target,filename)).isDirectory()});
    rep.end(JSON.stringify({statuscode:200,curpath:target,data:filelist}));
  }
});

module.exports=app;
