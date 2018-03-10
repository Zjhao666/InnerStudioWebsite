
import math
import time
from threading import Thread
class Resource:
    def __init__(self,expire=180,size=100):
        self.domain=[]
        self.maxRid=-1
        self.expire=expire
        self.size=size
        self.handleExpire=Thread(target=self._handleExpire,args=())
        self.handleExpire.setDaemon(True)
        self.handleExpire.start()
    def _handleExpire(self):
        while True:
            now=self._getTime()
            for i,item in enumerate(self.domain):
                if item[1]>=now:
                    self.domain.pop(i)
            time.sleep(1)
    def _getTime(self):
        return math.floor(time.time())+self.expire
    def add(self,res,token=False):
        if len(self.domain)>self.size:
            minTime=self._getTime()
            index=None
            for i,item in enumerate(self.domain):
                if item[1]<minTime:
                    minTime=item[1]
                    index=i
            self.domain.pop(index)
        self.maxRid+=1
        self.domain.append((self.maxRid,self._getTime(),res,token))
        return self.maxRid
    def remove(self,rid):
        for i,item in enumerate(self.domain):
            if rid==item[0]:
                self.domain.pop(i)
                return True
            elif rid>item[0]:
                break
    def require(self,rid):
        for item in self.domain:
            if rid==item[0]:
                item[1]=self._getTime()
                return item
            elif rid>item[0]:
                break
    def match(self,token):
        for item in self.domain:
            if item[3].startswith(token):
                return item[2]
    def update(self,rid,res):
        for item in self.domain:
            if rid==item[0]:
                item[2]=res
            elif rid>item[0]:
                break
