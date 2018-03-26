
let ursa=require('ursa'),
    encoding=require('encoding');

let maxBits=512,padding=ursa.RSA_PKCS1_PADDING;

function bytes(text, coding) {
    if (typeof text === 'undefined') {
        throw new Error("must have a arg.");
    }
    coding = coding || 'utf8';
    return Buffer.byteLength(text.toString(), coding);
}
module.exports={
  init:()=>{
    let keyPair=ursa.generatePrivateKey(maxBits,65537);
    return {
      privatePem:ursa.createPrivateKey(keyPair.toPrivatePem()),
      publicKey:keyPair.toPublicPem('utf8')
    };
  },
  encrypt:(plain, publicKey, realBit)=>{
      var start1 = 0;
      var end1   = realBit;
      var result1 = '';
      var originBuff = new Buffer(plain);
      var originByte = bytes(plain, 'utf8');
      while(start1 < originByte){
          var originTmp  = originBuff.slice(start1, end1);
          result1 += publicKey.encrypt(originTmp, 'binary', 'binary', padding);
          start1 += realBit;
          end1 += realBit;
      }

      var encrypted =  encoding.convert(result1, 'binary', 'base64');

      return encrypted.toString();
  },
  decrypt:(cipher, privateKey)=>{
      var start = 0;
      var maxBit = maxBits/8;
      var end = maxBit;
      var result = '';
      var cipherBuff = encoding.convert(cipher, 'base64', 'binary');   //这个地方很关键，直接使用new Buffer(cipher, 'base64') 报编码错误
      var cipherByte = bytes(cipher, 'base64');
      while(start < cipherByte){
          var cipherTmp  = cipherBuff.slice(start, end);    //请注意slice函数的用法
          result += privateKey.decrypt(cipherTmp, 'binary', 'binary', padding); //先保存成二进制，待完成解密后再转换成字符串
          start += maxBit;
          end += maxBit;
      }

      var decrypted =  encoding.convert(result, 'binary', 'utf8');
      return decrypted.toString();
  }
}
