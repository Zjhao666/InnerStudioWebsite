
let express=require('express'),
    util=require('util'),
    bodyParser=require('body-parser'),
    multer=require('multer');

let app=express();
require('express-ws')(app);
let urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('static'));
app.use(multer({ dest: '/tmp/'}).array('image'));

app.use('/login',require('./dynamic/login'));
app.use('/document',require('./dynamic/document'));
app.use('/member',require('./dynamic/member'));
// app.ws('/ws/notify',require('./dynamic/notify'));

app.get('/',(req,rep)=>{
  rep.send('Hello,world!');
});

let server=app.listen(8081,()=>{
  let host=server.address().address;
  let port=server.address().port;
  console.log("应用实例，访问地址为 http://%s:%s", host, port);
});
