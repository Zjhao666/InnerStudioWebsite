
#include "ThreadPool.h"

ThreadPool::ThreadPool():maxNum(50),availMinNum(10),tidCache(0),blockNum(5){
  for(int i=0;i<availMinNum;i++){
    tidCache=(tidCache+1)%1000000;
    Thread* thr=new Thread(tidCache);
    thr->setThreadPool(this);
    appendToFreeList(thr);
  }
}
ThreadPool::ThreadPool(int maxnum,int availmin):maxNum(maxnum),availMinNum(availmin),tidCache(0),blockNum(5){
  for(int i=0;i<availMinNum;i++){
    tidCache=(tidCache+1)%1000000;
    Thread* thr=new Thread(tidCache);
    thr->setThreadPool(this);
    appendToFreeList(thr);
  }
}
void ThreadPool::run(Job* job){
  assert(NULL!=job);
  Thread* thr=getAvailableThread();
  thr->setJob(job);
  thr->start();
}
void ThreadPool::terminateAll(void){
  freeMutex.lock();
  for(int i=0,limit=freeList.size();i<limit;i++){
    freeList[i]->stop();
  }
  freeMutex.unlock();

  busyMutex.lock();
  for(int i=0,limit=busyList.size();i<limit;i++){
    busyList[i]->stop();
  }
  busyMutex.unlock();
}
Thread* ThreadPool::getAvailableThread(void){
  if(freeList.size()==0){
    if(busyList.size()<maxNum){
      for(int i=0,num=busyList.size()+blockNum<=maxNum?blockNum:maxNum-busyList.size();i<num;i++){
        tidCache=(tidCache+1)%1000000;
        Thread* thr=new Thread(tidCache);
        thr->setThreadPool(this);
        appendToFreeList(thr);
      }
    }
    else while(freeList.size()==0) freeCond.wait();
  }
  if(freeList.size()>0){
    freeMutex.lock();
    Thread* thr=freeList.front();
    freeMutex.unlock();
    return thr;
  }
  return NULL;
}
void ThreadPool::appendToFreeList(Thread *thr){
  freeMutex.lock();
  vector<Thread*>::iterator pos;
  pos=find(freeList.begin(),freeList.end(),thr);
  if(pos==freeList.end()) freeList.push_back(thr);
  freeMutex.unlock();
}
void ThreadPool::moveToFreeList(Thread *thr){
  freeMutex.lock();
  freeList.push_back(thr);
  // payload check
  if(freeList.size()/maxNum>0.6){
    for(int i=0,limit=freeList.size()-availMinNum;i<limit;i++){
      Thread* thr=freeList[i];
      vector<Thread*>::iterator pos=find(freeList.begin(),freeList.end(),thr);
      freeList.erase(pos);
      thr->stop();
      while(!thr->ended());
      delete thr;
    }
  }
  freeMutex.unlock();
  busyMutex.lock();
  vector<Thread*>::iterator pos;
  pos=find(busyList.begin(),busyList.end(),thr);
  if(pos!=busyList.end()) busyList.erase(pos);
  busyMutex.unlock();
  // notify getAvaiableThread
  freeCond.notify();
}
void ThreadPool::moveToBusyList(Thread *thr){
  busyMutex.lock();
  busyList.push_back(thr);
  busyMutex.unlock();
  freeMutex.lock();
  vector<Thread*>::iterator pos;
  pos=find(freeList.begin(),freeList.end(),thr);
  if(pos!=freeList.end()) freeList.erase(pos);
  freeMutex.unlock();
}

extern "C"{
  ThreadPool obj;
  void run(Job* job){
    obj.run(job);
  }
  void terminateAll(void){
    obj.terminateAll();
  }
}
