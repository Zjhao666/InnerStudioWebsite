
let express=require('express'),
    util=require('util'),
    rsa=require('./lib/rsa'),
    bodyParser=require('body-parser'),
    dbAccess=require('./lib/dbAccess'),
    urlencodedParser=bodyParser.urlencoded({extended:false});

// base url part: login
let app=express();
let privatePem;
// require pk
app.get('/pk',(req,rep)=>{
  let ret=rsa.init();
  privatePem=ret.privatePem;
  rep.end(JSON.stringify({key:ret.publicKey}));
});
// check account & password
app.post('/validate',urlencodedParser,(req,rep)=>{
  let account=rsa.decrypt(req.body.cipher_ac,privatePem),
      password=rsa.decrypt(req.body.cipher_pw,privatePem);
  if(!account||!password) rep.end(JSON.stringify({statuscode:202,description:'null field'}));
  else{
    dbAccess.execute('select password from Account where account="'+account+'"',(err,row)=>{
      if(!err&&row&&row.length==1&&row[0].password==password) rep.end(JSON.stringify({statuscode:200}));
      else rep.end(JSON.stringify({statuscode:201}));
    });
  }
});
// regis
app.post('/regis',urlencodedParser,(req,rep)=>{
  let account=rsa.decrypt(req.body.cipher_ac,privatePem),
      password=rsa.decrypt(req.body.cipher_pw,privatePem);
  if(!account||!password) rep.end(JSON.stringify({statuscode:202,description:'null field'}));
  else{
    dbAccess.execute('insert into Account(account,password) values("'+account+'","'+password+'")',(err,row)=>{
      if(!err) rep.end(JSON.stringify({statuscode:200}));
      else if(err.errno==1062) rep.end(JSON.stringify({statuscode:201,description:'account exists'}));// duplicate account
      else rep.end(JSON.stringify({statuscode:203,description:util.inspect(err)}));
    });
  }
});

module.exports=app;
