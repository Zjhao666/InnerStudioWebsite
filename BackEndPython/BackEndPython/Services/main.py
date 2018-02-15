
from django.http import JsonResponse
from django.shortcuts import render
from lib.RSA import RSA
import json
from datetime import datetime
import hashlib
import sys
if sys.version_info[0]<3:
    import MySQLdb as mysql
else:
    import pymysql as mysql

keyStore=[]
cookie=[]

# database operation
def query(sql):
    with mysql.connect('101.200.37.220','root','Luncert428','InnerStudioWebsite') as cursor:
        retnum=cursor.execute(sql)
        if retnum:
            return cursor.fetchall()

def maketoken():
    time=str(datetime.now())
    h=hashlib.md5()
    h.update(time.encode('utf-8'))
    return h.hexdigest()

def chktoken():
    def inner(request):
        pass
    return inner

def login(request):
    p=int(request.GET['p'])
    if p==0:
        n,e1,e2=RSA.make(100,300)
        kid=len(keyStore)
        keyStore.append((n,e1))
        rep=JsonResponse({'kid':kid,'n':n,'e':e2})
        rep['Access-Control-Allow-Origin']='*'
        return rep
    elif p==1:
        kid=request.GET['kid']
        param=request.GET['param']
        if kid and int(kid)<len(keyStore) and int(kid)>=0 and param:
            key=keyStore[int(kid)]
            keyStore.pop(int(kid))
            ac,pw=RSA.decrypt(param.split(','),key[0],key[1]).split('&')
            ret=query('select * from Member where account='+ac)
            if ret and ret[0][5]==pw:
                statuscode=200
                token=maketoken()
                cookie.append(token)
                rep=JsonResponse({'statuscode':200})
                rep['Access-Control-Allow-Origin']='*'
                rep.set_cookie('token',token)
                return rep
            else:
                rep=JsonResponse({'statuscode':201})
                rep['Access-Control-Allow-Origin']='*'
                return rep
        else:
            rep=JsonResponse({'statuscode':199,'description':'invalid params'})
            rep['Access-Control-Allow-Origin']='*'
            return rep
    else:
        rep=JsonResponse({'statuscode':199,'description':'invalid params'})
        rep['Access-Control-Allow-Origin']='*'
        return rep
