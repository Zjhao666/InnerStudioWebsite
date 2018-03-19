
let express=require('express'),
    bodyParser=require('body-parser'),
    dbAccess=require('./lib/dbAccess'),
    util=require('util'),
    rsa=require('./lib/rsa'),
    urlencodedParser=bodyParser.urlencoded({extended:false});

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
  // match database
  dbAccess.execute('select password from Member where account="'+account+'"',(err,rows)=>{
    if(err) rep.end(JSON.stringify({statuscode:203,description:util.inspect(err)}));
    else if(rows.length==0) rep.end(JSON.stringify({statuscode:201,description:'account not exists'}))
    else if(rows[0].password==password) rep.end(JSON.stringify({statuscode:200}));
    else rep.end(JSON.stringify({statuscode:202,description:'incorrect password'}));
  });
});

module.exports=app;

