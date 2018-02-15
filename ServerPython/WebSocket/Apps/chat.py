
'''
protocal:
    recv:
        {
            "type":"+",
            "param":"sour:dest",
            "content":"xxx"
        }
        {
        {
            "type":"?",
            "target":x
        }
            "type":"*",
            "content":["xxx","xxx"]
        }
    send:
        {
            "type":"+",
            "param":"sour:dest",
            "content":"xxx"
        }
        {
            "type":"?",
            "content":[]
        }
        {
            "type":"*",
            "content":{
                "n":xx,
                "e":xx
            }
        }
        {
            "type":"/",
            "content":{
                "statuscode":200
            }
        }
'''

import sys
import json
import hashlib
from datetime import datetime
from lib.RSA import RSA
if sys.version_info[0]<3:
    import MySQLdb as mysql
else:
    import pymysql as mysql


urlpath='/chat'
workpath=os.path.join(WORKPATH,'chat')

# database operation
def query(sql):
    with mysql.connect('101.200.37.220','root','Luncert428','InnerStudioWebsite') as cursor:
        retnum=cursor.execute(sql)
        if retnum:
            return cursor.fetchall()

# standard implements

def onCreate(im,ctx):
    # validate-send pk
    n,e1,e2=RSA.make(100,300)
    ctx.sk=(n,e1)
    im.send_message(json.dumps({
        'type':'*',
        'content':{
            'n':n,
            'e':e2
        }
    }))
    return True

def onMessage(im,ctx,contact):
    data=json.loads(ctx.message)
    if data['type'].startswith('*'): # validate-check ac&pw
        ac,pw=RSA.decrypt(data['content'],ctx.sk[0],ctx.sk[1]).split('&')
        r=query('select * from Member where account='+ac)
        if r and r[0][5] is pw:
            ctx.aid=r[0][0] # id
            statuscode=200
            # check file in disk
            path=os.path.join(workpath,str(ctx.aid)+'.json')
            # load message records(JSON)
            with open(path,'rb') as f:
                if sys.version_info[0]<3:
                    data=f.read()
                else:
                    data=''.join((chr(c) for c in f.read()))
                ctx.msgbox=json.loads(data)
        else:
            im.close()
            statuscode=201
        im.send_message(json.dumps({
            'type':'/',
            'content':{'statuscode':statuscode}
        }))
    elif data['type'].startswith('+') and hasattr(ctx,'aid'): # send message
        sour,dest=data['param'].split(':')
        if sour is dest:
            return
        if sour is ctx.aid: # to another instance
            if contact(lambda item:bool(item.aid==dest),ctx.message):
                # contact successfully
                pass
            else:
                # add msg to buf file
                pass
        elif dest is ctx.aid:
            im.send_message(ctx.message)
        else:
            pass
    elif data['type'].startswith('?') and hasattr(ctx,'aid') and data['target']>=0:
        for item in ctx.msgbox:
            if item['target']==data['target']:
                im.send_message(json.dumps({
                    'type':'?',
                    'content':item['items']
                }))
                break
    else:
        im.close()
    # update msg record
def onDestroy(im,ctx):
    pass
