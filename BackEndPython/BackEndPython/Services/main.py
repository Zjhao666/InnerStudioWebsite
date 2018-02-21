
from django.http import JsonResponse
from django.http import HttpResponse
from django.shortcuts import render
from lib.RSA import RSA
from lib.Resource import Resource
from datetime import datetime
import PyPDF2
import PythonMagick
import json
import urllib
import hashlib
import sys
import os
import time
if sys.version_info[0]<3:
    import MySQLdb as mysql
else:
    import pymysql as mysql

DocRootPath='/home/lijingwei/Documents'
PdfTmpPath='/home/lijingwei/github/InnerStudioWebsite/BackEndPython/static'
keyStore=[]
sessions=Resource()

class Properties(object):
    def __init__(self,param):
        object.__init__(self)
        if not isinstance(param,dict):
            raise TypeError('param must be instance of dict')
        for key,value in param.items():
            setattr(self,key,value)
    def merge(self,props):
        if not isinstance(props,Properties):
            raise TypeError('param must be instance of Properties')
        for key,value in props:
            setattr(self,key,value)
    def __iter__(self):
        for item in dir(self):
            if item.startswith('__') and item.endswith('__') or item is 'merge':
                continue
            else:
                yield (item,getattr(self,item))
    def __str__(self):
        return '[Properties instance]:\n'+'\n'.join([item[0]+':\t'+str(item[1]) for item in self])

class PDF:
    def __init__(self,path,outputDir):
        self.path=path
        self.pages=PyPDF2.PdfFileReader(file(path,"rb")).getNumPages()
        self.outputDir=outputDir
    def read(self,index,ds=1024):
        if index>=0 and index<self.pages:
            image=PythonMagick.Image()
            image.density(str(ds))
            image.read(self.path+'['+str(index)+']')
            image.magick("PNG")
            filename=os.path.basename(self.path)+str(index)+'.png'
            image.write(os.path.join(self.outputDir,filename))
            return filename

def wrapper(func):
    def inner(request):
        token=request.GET.get('istoken',False)
        if token:
            request.context=sessions.match(token)
            return func(request)
        else:
            return JsonResponse({'statuscode':199,'description':'token missed'})
    return inner

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

def file_iter(path,block_size):
    with open(path,'rb') as f:
        b=f.read(block_size)
        yield b
        while len(b)==block_size:
            b=f.read(block_size)
            yield b

# urls

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
                istoken=maketoken()
                sessions.add(Properties({}),istoken)
                rep=JsonResponse({'statuscode':200,'istoken':istoken})
                return rep
            else:
                return JsonResponse({'statuscode':201,'description':'wrong password or account not exists'})
        else:
            return JsonResponse({'statuscode':199,'description':'invalid params'})
    else:
        return JsonResponse({'statuscode':199,'description':'invalid params'})

@wrapper
def documents(request):
    param=request.GET.get('param',False)
    target=request.GET.get('target',False)
    exten=request.GET.get('exten',False)
    if param.startswith('dir'):
        target=target if target else DocRootPath
        if not os.path.exists(target):
            target=urllib.parse.unquote(target)
        ret=[]
        for filename in os.listdir(target):
            if os.path.isdir(os.path.join(target,filename)):
                ret.append({'name':filename,'type':0})
            elif filename.endswith('.pdf'):
                ret.append({'name':filename,'type':1})
            else:
                ret.append({'name':filename,'type':2})
        return HttpResponse(json.dumps({'basepath':target,'items':ret}))
    elif param.startswith('detail'):
        ret={
            'filename':os.path.basename(target),
            'location':target,
            'type':'',
            'size':''
        }
        if os.path.isfile(target):
            ret['size']=os.stat(target).st_size
        return JsonResponse({'basepath':target,'detail':ret})
    elif param.startswith('pdf'):
        if not os.path.exists(target):
            return JsonResponse({'statuscode':199,'description':'path not exists'})
        tmpPath=os.path.join(PdfTmpPath,os.path.basename(target)+'[%s].png'%exten)
        print tmpPath
        if os.path.exists(tmpPath):
            return StreamingHttpResponse(file_iter(tmpPath,4096))
        elif request.context:
            if not hasattr(request.context,'pdfHandler'):
                request.context.pdfHandler=PDF(target,PdfTmpPath)
            filename=request.context.pdfHandler.read(int(exten))
            return StreamingHttpResponse(file_iter(os.path.join(PdfTmpPath,filename),4096))
        else:
            return JsonResponse({'statuscode':199,'description':'access refused'})
