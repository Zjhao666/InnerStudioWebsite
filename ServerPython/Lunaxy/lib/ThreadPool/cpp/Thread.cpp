
#include "Thread.h"

Thread::Thread(int id):threadID(id),threadName(NULL),job(NULL),beSuspend(true),beWorking(true),beEnd(false){
  thr=new thread(run,this);
  thr->detach();
}
Thread::~Thread(){
  if(NULL!=threadName){
    free(threadName);
    threadName=NULL;
  }
  if(NULL!=thr){
    delete thr;
    thr=NULL;
  }
}
bool Thread::ended(){
  return beEnd;
}
void Thread::start(){
  vmutex.lock();
  if(beSuspend){
    beSuspend=false;
    thrPool->moveToBusyList(this);
    cond.notify();
  }
  vmutex.unlock();
}
void Thread::stop(){
  vmutex.lock();
  beWorking=false;
  if(beSuspend){
    beSuspend=false;
    cond.notify();
  }
  vmutex.unlock();
}
void Thread::setJob(Job* job){
  jobMutex.lock();
  this->job=job;
  jobMutex.unlock();
}
void Thread::clearJob(void){
  jobMutex.lock();
  this->job=NULL;
  jobMutex.unlock();
}
void Thread::setThreadPool(ThreadPool* thrpool){this->thrPool=thrpool;}
int Thread::getThreadID(void){return threadID;}
void Thread::setThreadName(char* name){
  if(NULL!=name){
    threadName=(char*)malloc(strlen(name)+1);
    strcpy(threadName,name);
  }
}
char* Thread::getThreadName(void){return threadName;}
void Thread::run(Thread* handler){
  while(handler->beSuspend) handler->cond.wait();
  while(handler->beWorking){
    // running
    handler->jobMutex.lock();
    if(NULL!=handler->job) handler->job->handle();
    handler->jobMutex.unlock();
    // suspending
    handler->vmutex.lock();
    handler->beSuspend=true;
    handler->vmutex.unlock();
    handler->thrPool->moveToFreeList(handler);
    while(handler->beSuspend) handler->cond.wait();
  }
  handler->beEnd=true;
}
