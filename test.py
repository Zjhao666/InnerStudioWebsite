import os
import time
from threading import Thread

def handle1(fd):
    while True:
        buf=os.read(fd,1024)
        if buf:
            print 'GET:%s'%buf
def handle2(fd):
    while True:
        buf=os.read(0,1024)
        if buf:
            print 'SEND:%s'%buf
            os.write(fd,buf)

p2cr,p2cw=os.pipe()
c2pr,c2pw=os.pipe()
pid=os.fork()
if pid==0:  # child
    os.close(p2cw)
    os.close(c2pr)
    os.dup2(p2cr,0)
    os.dup2(c2pw,1)
    os.execvp('python',['python'])
    os._exit(0)
else:
    os.close(p2cr)
    os.close(c2pw)
    t=Thread(target=handle1,args=(c2pr,))
    t.setDaemon(True)
    t.start()
    t=Thread(target=handle2,args=(p2cw,))
    t.setDaemon(True)
    t.start()
    time.sleep(5)
