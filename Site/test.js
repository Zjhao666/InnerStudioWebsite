// let req=require('request');
// req.get('http://localhost:8081/login/pk',(err,rep,body)=>{
//   console.log(body);
// });

var fs = require('fs')
  , ursa = require('ursa')
  , crt
  , key
  , msg
  , m
  ;

m=ursa.generatePrivateKey(512,65537);
key=ursa.createPrivateKey(m.toPrivatePem());
crt = ursa.createPublicKey(m.toPublicPem());

console.log('Encrypt with Public');
msg = crt.encrypt("asdasdasdasdasdasdvdfe", 'utf8', 'base64'); // 22
console.log('encrypted', msg, '\n');

console.log('Decrypt with Private');
msg = key.decrypt(msg, 'base64', 'utf8');
console.log('decrypted', msg, '\n');

console.log('############################################');
console.log('Reverse Public -> Private, Private -> Public');
console.log('############################################\n');

console.log('Encrypt with Private (called public)');
msg = key.privateEncrypt("Everything is going to be 200 OK", 'utf8', 'base64');
console.log('encrypted', msg, '\n');

console.log('Decrypt with Public (called private)');
msg = crt.publicDecrypt(msg, 'base64', 'utf8');
console.log('decrypted', msg, '\n');
