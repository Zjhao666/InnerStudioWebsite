
import math
import sys
from random import random

class RSA(object):
    @staticmethod
    def make(minnum,numRange):
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
            return bool(b<=1)
        def makePrime():
            buf=set()
            while True:
                tmp=minnum+int(math.floor(random()*numRange))
                if bePrime(tmp):
                    return tmp
                elif not tmp in buf:
                    buf.add(tmp)
        def makeE1(c):
            buf=set()
            while True:
                tmp=1+int(math.floor(random()*(c-1)))
                if isrp(tmp,c):
                    return tmp
                elif not tmp in buf:
                    buf.add(tmp)
        def makeE2(e1,c):
            i=1
            while True:
                a=c*i+1
                if a%e1==0:
                    return int(a/e1)
                i+=1
        p=makePrime()
        while True:
            q=makePrime()
            if q!=p:
                break
        tmp=(p-1)*(q-1)
        n=p*q
        e1=makeE1(tmp)
        e2=makeE2(e1,tmp)
        return (n,e1,e2)
    @staticmethod
    def encrypt(data,kn,ke):
        result=[]
        if sys.version_info[0]<3:
            for i in bytes(data):
                result.append(ord(i)**ke%kn)
        else:
            for i in bytes(data,encoding='utf-8'):
                result.append(i**ke%kn)
        return result
    @staticmethod
    def decrypt(data,kn,ke):
        result=[]
        for i in data:
            result.append(chr(int(i)**ke%kn))
        return ''.join(result)
