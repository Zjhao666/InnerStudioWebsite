
from django.http import JsonResponse
from django.http import HttpResponse
from django.shortcuts import render
from lib.RSA import RSA
from datetime import datetime
import json
import hashlib
import sys
import os
if sys.version_info[0]<3:
    import MySQLdb as mysql
else:
    import pymysql as mysql

keyStore=[]
tokens=[]
DocRootPath='/home/lijingwei/Documents'

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

def chktoken(func):
    def inner(request):
        token=request.COOKIES.get('token',False)
        if token and token in tokens:
            func(request)
        else:
            return JsonResponse({'statuscode':199,'description':'token missed'})
    return inner

def login(request):
    p=int(request.GET['p'])
    if p==0:
        n,e1,e2=RSA.make(100,300)
        kid=len(keyStore)
        keyStore.append((n,e1))
        return JsonResponse({'kid':kid,'n':n,'e':e2})
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
                rep.set_cookie('token',token)
                return rep
            else:
                return JsonResponse({'statuscode':201})
        else:
            return JsonResponse({'statuscode':199,'description':'invalid params'})
    else:
        return JsonResponse({'statuscode':199,'description':'invalid params'})

@chktoken
def plan(request):
    pass

# @chktoken
def documents(request):
    ret=[]
    target=DocRootPath
    for filename in os.listdir(target):
        if os.path.isdir(os.path.join(target,filename)):
            ret.append({'name':filename,'isdir':True})
        else:
            ret.append({'name':filename,'isdir':False})
    return HttpResponse(json.dumps(ret))
