
'''
protocal:
    recv:
        {
            "type":"*",
            "content":["xxx","xxx"]
        }
        {
            "type":"+",
            "targegt":"/home/xxx"
            "command":"dir"
        }
    send:
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
        {
            "type":"+",
            "content":"xxx"
        }
'''

import sys
import json
import hashlib
from datetime import datetime
from subprocess import Popen,PIPE
from lib.RSA import RSA
if sys.version_info[0]<3:
    import MySQLdb as mysql
else:
    import pymysql as mysql

urlpath='/serverConsole'

# database operation
def query(sql):
    with mysql.connect('101.200.37.220','root','Luncert428','InnerStudioWebsite') as cursor:
        retnum=cursor.execute(sql)
        if retnum:
            return cursor.fetchall()

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
            ctx.workpath='/usr'
            content={
                'statuscode':200,
                'path':ctx.workpath
            }
            path=os.path.join(workpath,str(ctx.aid)+'.json')
            # load message records(JSON)
            if os.path.exists(path):
                with open(path,'rb') as f:
                    if sys.version_info[0]<3:
                        data=f.read()
                    else:
                        data=''.join((chr(c) for c in f.read()))
                    ctx.msgbox=json.loads(data)
        else:
            im.close()
            content={'statuscode':201}
        im.send_message(json.dumps({
            'type':'/',
            'content':content
        }))
    elif data['type'].startswith('+') and hasattr(ctx,'aid'):
        p=Popen('bash',stdin=PIPE,stdout=PIPE)
        if not os.path.exists(data['target']):
            content={
                'host':'server',
                'path':ctx.workpath,
                'command':data['command'],
                'result':'path not exists'
            }
        elif os.path.isfile(data['target']):
            content={
                'host':'server',
                'path':ctx.workpath,
                'command':data['command'],
                'result':'target is a file'
            }
        else:
            ctx.workpath=data['target']
            command=data['command']
            if sys.version_info[0]<3:
                data=bytes('cd %s\n'%ctx.workpath+data['command'])
            else:
                data=bytes('cd %s\n'%ctx.workpath+data['command'],encoding='utf-8')
            ret,err=p.communicate(input=data)
            content={
                'host':'server',
                'path':ctx.workpath,
                'command':command,
                'result':bytes.decode(err) if err else bytes.decode(ret)
            }
        im.send_message(json.dumps({
            'type':'+',
            'content':content
        }));

    else:
        im.close()

def onDestroy(im,ctx):
    pass
