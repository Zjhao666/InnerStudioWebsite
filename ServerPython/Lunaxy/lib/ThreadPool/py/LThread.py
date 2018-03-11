
from threading import Thread,Condition

class LThread:
    def __init__(self,thrpool,tid,name=''):
        self.threadID=tid
        self.threadName=name
        self.beSuspend=True
        self.beWorking=True
        self.beEnd=False
        self.job=None
        self.__cond=Condition()
        self.__thrpool=thrpool
        self.__thr=Thread(target=self.__run,args=())
        self.__thr.setDaemon(True)
        self.__thr.start()
    def __run(self):
        self.__cond.acquire()
        while self.beSuspend:
            self.__cond.wait()
        self.__cond.release()
        while self.beWorking:
            if self.job:
                self.job.handle()
            self.__thrpool._moveToFreeList(self)
            self.__cond.acquire()
            self.beSuspend=True
            while self.beSuspend:
                self.__cond.wait()
            self.__cond.release()
        self.__cond.acquire()
        self.beEnd=True
        self.__cond.notify()
        self.__cond.release()
    def start(self):
        if self.beSuspend:
            self.__cond.acquire()
            self.__thrpool._moveToBusyList(self)
            self.beSuspend=False
            self.__cond.notify()
            self.__cond.release()
    def stop(self):
        self.__cond.acquire()
        self.beWorking=False
        if self.beSuspend:
            self.beSuspend=False
            self.__cond.notify()
        if not self.beEnd:
            self.__cond.wait()
        self.__cond.release()
    def setJob(self,job):
        if not hasattr(job,'handle'):
            raise TypeError('job without "handle" function.')
        self.job=job
    def clearJob(self):
        self.job=None
