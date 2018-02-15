
class RSA{
  constructor(){
    const bePrime=(num)=>{
      if(num==2||num==3) return true;
      if(num%6!=1&&(num%6)!=5) return false;
      let tmp=parseInt(Math.floor(Math.sqrt(num)));
      for(let i=5;i<=tmp;i+=6){
        if(num%i==0||num%(i+2)==0) return false;
      }
      return true;
    };
    const isrp=(a,b)=>{
      let t;
      if(a<=0||b<=0||a==b) return false;
      else if(a==1||b==1) return true;
      else{
        while(true){
          t=a%b;
          if(t){
            a=b;
            b=t;
          }
          else break;
        }
        if(b>1) return false;
        else return true;
      }
    };
    const makePrime=(minnum,numRange)=>{
      let tmp,buf=new Set();
      while(true){
        tmp=minnum+parseInt(Math.floor(Math.random()*numRange));
        if(buf.has(tmp)) continue;
        else if(bePrime(tmp)) return tmp;
        else buf.add(tmp);
      }
    };
    const makeE1=(c)=>{
      let tmp,buf=new Set();
      while(true){
        tmp=1+parseInt(Math.floor(Math.random()*(c-1)));
        if(buf.has(tmp)) continue;
        else if(isrp(tmp,c)) return tmp;
        else buf.add(tmp);
      }
    };
    const makeE2=(e1,c)=>{
      let i=1,a;
      while(true){
        a=c*i+1;
        if(a%e1==0) return parseInt(a/e1);
        i+=1;
      }
    };
    let p=makePrime(100,500),q,c;
    while(true){
      q=makePrime(100,500);
      if(q!=p) break;
    }
    c=(q-1)*(p-1);
    this.n=p*q;
    this.e1=makeE1(c);
    this.e2=makeE2(this.e1,c);
  }
  encrypt(data){
    let result=new Array(),
        e2=new BigInteger(this.e2.toString()),
        n=new BigInteger(this.n.toString());
    for(let i=0;i<data.length;i++){
      let tmp=new BigInteger(data.charCodeAt(i).toString());
      result.push(tmp.pow(e2).mod(n).toString());
    }
    return result;
  }
  decrypt(data){
    let result=new Array(),
        e1=new BigInteger(this.e1.toString()),
        n=new BigInteger(this.n.toString());
    for(let i=0;i<data.length;i++){
      let tmp=new BigInteger(data[i]);
      result.push(String.fromCharCode(parseInt(tmp.pow(e1).mod(n).toString())));
    }
    return result.join('');
  }
}

if(window.jsbn){
  window.RSA=RSA;
  RSA.encryptAlone=(data,pkn,pke)=>{
    let result=new Array(),
        n=new BigInteger(pkn.toString()),
        e2=new BigInteger(pke.toString());
    for(let i=0;i<data.length;i++){
      let tmp=new BigInteger(data.charCodeAt(i).toString());
      result.push(tmp.pow(e2).mod(n).toString());
    }
    return result;
  };
  window.BigInteger=jsbn.BigInteger;
}
