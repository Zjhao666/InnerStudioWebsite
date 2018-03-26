
let express=require('express');
let util=require('util');
let bodyParser=require('body-parser');
let multer  = require('multer');

let app=express();
let urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('static'));
app.use('/login',require('./dynamic/login'));
app.use('/dataUpdate',require('./dynamic/dataUpdate'));
app.use('/dataFetch',require('./dynamic/dataFetch'));

// app.use(multer({ dest: '/tmp/'}).array('image'));

app.get('/',(req,rep)=>{
  rep.send('Hi!');
});

let server=app.listen(8080,()=>{
  let host=server.address().address;
  let port=server.address().port;
  console.log("应用实例，访问地址为 http://%s:%s", host, port);
})
