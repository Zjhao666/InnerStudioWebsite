
if(window.jsbn){
  window.BigInteger=jsbn.BigInteger;
  window.RSA={
    make:(minnum,numRange)=>{
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
      const makePrime=()=>{
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
      let p=makePrime(),q,c;
      while(true){
        q=makePrime();
        if(q!=p) break;
      }
      c=(q-1)*(p-1);
      let n=p*q,
          e1=makeE1(c),
          e2=makeE2(e1,c);
      return {n:n,e1:e1,e2:e2};
    },
    encrypt:(data,kn,ke)=>{
      if(typeof(kn)!=='string') kn=kn.toString();
      if(typeof(ke)!=='string') ke=ke.toString();
      let result=new Array(),
          e=new BigInteger(ke.toString()),
          n=new BigInteger(kn.toString());
      for(let i=0;i<data.length;i++){
        let tmp=new BigInteger(data.charCodeAt(i).toString());
        result.push(tmp.pow(e).mod(n).toString());
      }
      return result;
    },
    decrypt:(data,kn,ke)=>{
      if(typeof(kn)!=='string') kn=kn.toString();
      if(typeof(ke)!=='string') ke=ke.toString();
      let result=new Array(),
          e=new BigInteger(ke.toString()),
          n=new BigInteger(kn.toString());
      for(let i=0;i<data.length;i++){
        let tmp=new BigInteger(data[i]);
        result.push(String.fromCharCode(parseInt(tmp.pow(e).mod(n).toString())));
      }
      return result.join('');
    }
  };
}
