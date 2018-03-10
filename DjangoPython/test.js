
let RSA={
  encrypt:(data,kn,ke)=>{
    if(typeof(kn)!=='string') kn=kn.toString();
    if(typeof(ke)!=='string') ke=ke.toString();
    let result=new Array(),
        e=new BigInteger(ke),
        n=new BigInteger(kn);
    for(let i=0;i<data.length;i++){
      let tmp=new BigInteger(data.charCodeAt(i).toString());
      result.push(tmp.pow(e).mod(n).toString());
    }
    return result;
  }
};

let jsbn=require('jsbn'),
    BigInteger=jsbn.BigInteger,
    req=require('request');
req.get({'url':'http://127.0.0.1:8000/login.do?p=0'},
  (err,rep,body)=>{
    let pk=JSON.parse(body);
    let e=RSA.encrypt('Luncert&123456',pk.n,pk.e);
    req.get({'url':'http://localhost:8000/login.do?p=1&param='+e},
      (err,rep,body)=>{
          console.log(body);
      });
  });
