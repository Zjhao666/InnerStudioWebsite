
import math
import sys
from random import random

class RSA(object):
    def __init__(self):
        def bePrime(num):
            if num==2 or num==3:
                return True
            if (num%6)!=1 and (num%6)!=5:
                return False
            tmp=int(math.floor(math.sqrt(num)))
            for i in range(5,tmp+1,6):
                if (num%i)==0 or (num%(i+2))==0:
                    return False
            return True
        def isrp(a,b):
            if a<=0 or b<=0 or a==b:
                return False
            elif a==1 or b==1:
                return True
            else:
                while True:
                    t=a%b
                    if t:
                        a=b
                        b=t
                    else:
                        break
            if b>1:
                return False
            else:
                return True
        def makePrime(minnum,numRange):
            buf=set()
            while True:
                tmp=minnum+int(math.floor(random()*numRange))
                if tmp in buf:
                    continue
                elif bePrime(tmp):
                    return tmp
                else:
                    buf.add(tmp)
        def makeE1(c):
            buf=set()
            while True:
                tmp=1+int(math.floor(random()*(c-1)))
                if tmp in buf:
                    continue
                elif isrp(tmp,c):
                    return tmp
                else:
                    buf.add(tmp)
        def makeE2(e1,c):
            i=1
            while True:
                a=c*i+1
                if a%e1==0:
                    return int(a/e1)
                i+=1
        # p
        p=makePrime(100,500)
        # q
        while True:
            q=makePrime(100,500)
            if q!=p:
                break
        tmp=(p-1)*(q-1)
        # n
        n=p*q
        # e1
        e1=makeE1(tmp)
        # e2
        e2=makeE2(e1,tmp)
        self.n=n
        self.e1=e1
        self.e2=e2
    def encrypt(self,data):
        result=[]
        if sys.version_info[0]<3:
            for i in bytes(data):
                result.append(ord(i)**self.e2%self.n)
        else:
            for i in bytes(data,encoding='utf-8'):
                result.append(i**self.e2%self.n)
        return result
    def decrypt(self,data):
        result=[]
        for i in data:
            result.append(chr(int(i)**self.e1%self.n))
        return ''.join(result)
    def getPublickey(self):
        return {'n':self.n,'e':self.e2}
