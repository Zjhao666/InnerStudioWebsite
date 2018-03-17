
let express=require('express');
let util=require('util');
let bodyParser=require('body-parser');
let multer=require('multer');

let app=express();
let urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('static'));
app.use(multer({ dest: '/tmp/'}).array('image'));

app.use('/login',require('./dynamic/login.js'));
app.use('/document',require('./dynamic/document.js'));
app.use('/member',require('./dynamic/member.js'));

app.get('/',(req,rep)=>{
  rep.send('Hello,world!');
});

let server=app.listen(8081,()=>{
  let host=server.address().address;
  let port=server.address().port;
  console.log("应用实例，访问地址为 http://%s:%s", host, port);
});
