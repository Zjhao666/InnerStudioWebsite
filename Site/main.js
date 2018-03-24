
let express=require('express'),
    util=require('util'),
    multer=require('multer'),
    urlencodedParser=require('body-parser').urlencoded({extended:false});

let app=express();
require('express-ws')(app);

let context=[];
app.use(require('cookie-parser')());
app.use((req,rep,next)=>{
  req.addNewInstance=(key,value)=>context[key]=value;
  if(req.cookies['MACookie']&&context[req.cookies['MACookie']]){
    req.session=context[req.cookies['MACookie']];
    req.allowed=true;
  }
  else req.allowed=false;
  next();
});
app.use(express.static('static'));
// app.use(multer({ dest: '/tmp/'}).array('image'));
let member=require('./dynamic/member');
app.use('/member',member);
app.ws('/chat',member.chat);
app.use('/plan',require('./dynamic/plan'));
app.use('/project',require('./dynamic/project'));
app.use('/login',require('./dynamic/login'));
app.use('/document',require('./dynamic/document'));

app.get('/',(req,rep)=>{
  rep.send('Hello,world!');
});

let server=app.listen(8081,()=>{
  let host=server.address().address;
  let port=server.address().port;
  console.log("应用实例，访问地址为 http://%s:%s", host, port);
});
