
from LThread import LThread
from threading import Thread,Condition,Lock

class ThreadPool:
    def __init__(self,maxnum=50,minnum=10,piecenum=5,heavyLoad=0.6):
        self.__mtx=Lock()
        self.__cond=Condition()
        self.__tidCache=0
        self.__busyNum=0
        self.__freeNum=0
        self.__busyList=[]
        self.__freeList=[]
        self.maxNum=maxnum # 50
        self.availMinNum=minnum # 10
        self.pieceNum=piecenum # 5
        self.heavyLoad=heavyLoad # 0.6
        # create init threads
        for i in range(minnum):
            self.__tidCache=(self.__tidCache+1)%1000000
            thr=LThread(self,self.__tidCache)
            self.__freeList.append(thr)
        self.__freeNum=minnum
    def __spwanThread(self,force=False):
        if self.__freeNum+self.__busyNum*1.0/self.maxNum>self.heavyLoad and not force:
            return 0
        self.__cond.acquire()
        while self.__freeNum+self.__busyNum>=self.maxNum:
            self.__cond.wait()
        self.__cond.release()
        rest=self.maxNum-self.__busyNum-self.__freeNum
        num=self.pieceNum if rest>=self.pieceNum else rest
        self.__mtx.acquire()
        for i in range(num):
            self.__tidCache=(self.__tidCache+1)%1000000
            thr=Thread(self,self.__tidCache)
            self.__freeList.append(thr)
        self.__freeNum+=num
        self.__mtx.release()
    def __collectThread(self):
        if self.__freeNum*1.0/self.maxNum>self.heavyLoad:
            num=self.pieceNum if self.__freeNum>=self.pieceNum else 0
            self.__mtx.acquire()
            for i in range(num):
                thr=self.__freeList.pop()
                thr.stop()
            self.__freeNum-=num
            self.__mtx.release()
    def _moveToFreeList(self,thr):
        self.__mtx.acquire()
        self.__freeList.append(thr)
        self.__freeNum+=1
        self.__busyList.remove(thr)
        self.__busyNum-=1
        self.__mtx.release()
        # notify __spwanThread
        self.__cond.acquire()
        self.__cond.notify()
        self.__cond.release()
        self.__collectThread()
    def _moveToBusyList(self,thr):
        self.__mtx.acquire()
        self.__busyList.append(thr)
        self.__busyNum+=1
        self.__freeList.remove(thr)
        self.__freeNum-=1
        self.__mtx.release()
    def run(self,job):
        if self.__freeNum==0:
            self.__spwanThread(True,False)
        thr=self.__freeList[0]
        thr.setJob(job)
        thr.start()
    def terminateAll(self):
        self.__mtx.acquire()
        for i in range(self.__freeNum):
            self.__freeList.pop().stop()
        for i in range(self.__busyNum):
            self.__busyList.pop().stop()
        self.__freeNum=0
        self.__busyNum=0
        self.__mtx.release()
    def getFreeNum(self):
        return self.__freeNum
    def getBusyNum(self):
        return self.__busyNum
