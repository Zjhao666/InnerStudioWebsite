
enum ThreadState{Aborted,AbortRequested,Background,Running,Stopped,StopRequested,Suspended,SuspendRequested,Unstarted,WaitSleepJoin};

class ThreadPool;
class Thread;

class ThreadPool{
friend class Thread;
private:
  unsigned int maxNum;
  unsigned int availLow;
  unsigned int availHigh;
  unsigned int availNum;
  unsigned int initNum;
protected:
  Thread* getIdleThread(void);
  void appendToIdleList(Thread* jobthread);
  void moveToBusyList(Thread* idlethread);
  void moveToIdleList(Thread* busythread);
  void createIdleThread(int num);
  void deleteIdleThread(int num);
public:
  std::mutex busyMutex;
  std::mutex idleMutex;
  std::mutex jobMutex;
  std::mutex varMutex;
  Condition busyCond;
  Condition idleCond;
  Condition idleJobCond;
  Condition maxNumCond;
  vector<Thread*> threadList;
  vector<Thread*> busyList;
  vector<Thread*> idleList;
  ThreadPool();
  ThreadPool(int num);
  virtual ~ThreadPool();
  void terminateAll(void);
  void run(Job* job,void* jobdata);
  // set & get
  void setMaxNum(int num);
  int getMaxNum(void);
  void setAvailLowNum(int num);
  int getAvailLowNum(void);
  void setAvailHighNum(int num);
  int getAvailHighNum(void);
  void setInitNum(int num);
  int getInitNum(void);
  int getActualAvailNum(void);
  int getAllNum(void);
  int getBusyNum(void);
};

class Thread:public thread{
private:
  int errCode;
  unsigned long threadID;
  char* threadName;
  ThreadState threadState;

  ThreadPool* threadPool;
  Job* job;
  void* jobData;

  bool beEnd;
  std::mutex varMutex;
public:
  Condition jobCond;
  std::mutex workMutex;
  Thread();
  Thread(unsigned long id,char* name);
  ~Thread();
  void run();
  void start();
  // set & get
  void setJob(Job* job,void* jobdata);
  Job* getJob(void);
  void setThreadPool(ThreadPool* thrPool);
  ThreadPool* getThreadPool(void);
  void setThreadID(unsigned long id);
  unsigned long getThreadID();
  void setThreadState(ThreadState state);
  ThreadState getThreadState(void);
  void setThreadName(char* name);
  char* getThreadName(void);
  int getLastError(void);
};


// protected
Thread* ThreadPool::getIdleThread(void){
  while(idleList.size()==0) idleCond.wait();
  idleMutex.lock();
  if(idleList.size()>0){
    Thread* thr=(Thread*)idleList.front();
    cout<<"Get Idle thread "<<thr->getThreadID()<<endl;
    idleMutex.unlock();
    return thr;
  }
  idleMutex.unlock();
  return NULL;
}
void ThreadPool::appendToIdleList(Thread *jobthread){
  idleMutex.lock();
  idleList.push_back(jobthread);
  threadList.push_back(jobthread);
  idleMutex.unlock();
}
void ThreadPool::moveToBusyList(Thread *idlethread){
  busyMutex.lock();
  busyList.push_back(idlethread);
  availNum--;
  busyMutex.unlock();

  idleMutex.lock();
  vector<Thread*>::iterator pos;
  pos=find(idleList.begin(),idleList.end(),idlethread);
  if(pos!=idleList.end()) idleList.erase(pos);
  idleMutex.unlock();
}
void ThreadPool::moveToIdleList(Thread *busythread){
  idleMutex.lock();
  idleList.push_back(busythread);
  availNum++;
  idleMutex.unlock();

  busyMutex.lock();
  vector<Thread*>::iterator pos;
  pos=find(busyList.begin(),busyList.end(),busythread);
  if(pos!=busyList.end()) busyList.erase(pos);
  busyMutex.unlock();

  idleCond.notify();
  maxNumCond.notify();
}
void ThreadPool::createIdleThread(int num){
  for(int i=0;i<num;i++){
    Thread* thr=new Thread();
    thr->setThreadPool(this);
    appendToIdleList(thr);
    varMutex.lock();
    availNum++;
    varMutex.unlock();
    thr->start();
  }
}
void ThreadPool::deleteIdleThread(int num){
  cout<<"Enter into ThreadPool::DeleteIdleThreadn"<<endl;
  idleMutex.lock();
  cout<<"Delete Num is "<<num<<endl;
  for(int i=0;i<num;i++){
    Thread* thr;
    if(idleList.size()>0){
      thr=(Thread*)idleList.front();
      cout<<"Get Idle thread "<<thr->getThreadID()<<endl;
    }
    vector<Thread*>::iterator pos;
    pos=find(idleList.begin(),idleList.end(),thr);
    if(pos!=idleList.end()) idleList.erase(pos);
    availNum--;
    cout<<"The idle thread available num "<<availNum<<endl;
    cout<<"The idlelist num "<<idleList.size()<<endl;
    idleMutex.unlock();
  }
}
// public
ThreadPool::ThreadPool(){
  maxNum=50;
  availLow=5;
  availHigh=20;
  initNum=availNum=10;

  busyList.clear();
  idleList.clear();
  for(int i=0;i<initNum;i++){
    Thread* thr=new Thread();
    appendToIdleList(thr);
    thr->setThreadPool(this);
    thr->start();
  }
}
ThreadPool::ThreadPool(int num){
  assert(num>0 && num<=30);

  maxNum=30;
  availLow=num-10>0?num-10:3;
  initNum=availNum=num;
  availHigh=num+10;

  busyList.clear();
  idleList.clear();
  for(int i=0;i<initNum;i++){
    Thread* thr=new Thread();
    appendToIdleList(thr);
    thr->setThreadPool(this);
    thr->start();
  }
}
ThreadPool::~ThreadPool(){
  terminateAll();
}
void ThreadPool::terminateAll(){
  for(int i=0,limit=threadList.size();i<limit;i++){
    Thread* thr=threadList[i];
    thr->join();
  }
  return;
}
void ThreadPool::run(Job* job,void* jobdata){
  assert(job!=NULL);

  if(getBusyNum()==maxNum) maxNumCond.wait();
  if(idleList.size()<availLow){
    if(getAllNum()+initNum-idleList.size()<maxNum) createIdleThread(initNum-idleList.size());
    else createIdleThread(maxNum-getAllNum());
    Thread* idlethr=getIdleThread();
    if(idlethr!=NULL){
      idlethr->workMutex.lock();
      moveToBusyList(idlethr);
      idlethr->setThreadPool(this);
      // job->setWorkThread(idlethr);
      cout<<"Job is set to thread "<<idlethr->getThreadID()<<endl;
      idlethr->setJob(job,jobdata);
    }
  }
}
void ThreadPool::setMaxNum(int num){maxNum=num;}
int ThreadPool::getMaxNum(void){return maxNum;}
void ThreadPool::setAvailLowNum(int num){availLow=num;}
int ThreadPool::getAvailLowNum(void){return availLow;}
void ThreadPool::setAvailHighNum(int num){availHigh=num;}
int ThreadPool::getAvailHighNum(void){return availHigh;}
void ThreadPool::setInitNum(int num){initNum=num;}
int ThreadPool::getInitNum(void){return initNum;}
int ThreadPool::getActualAvailNum(void){return availNum;}
int ThreadPool::getAllNum(void){return threadList.size();}
int ThreadPool::getBusyNum(void){return busyList.size();}


Thread::Thread():thread(),threadID(0),threadName(NULL){
  job=NULL;
  jobData=NULL;
  threadPool=NULL;
  beEnd=false;
}
Thread::Thread(unsigned long id,char* name):thread(),threadID(id){
  assert(NULL!=name);
  threadName=(char*)malloc(strlen(name)+1);
  strcpy(threadName,name);
}
Thread::~Thread(){
  if(NULL!=threadName){
    free(threadName);
    threadName=NULL;
  }
}
void Thread::run(){
  setThreadState(Running);
  while(1){
    while(job==NULL) jobCond.wait();
    job->run(jobData);
    // job->setWorkThread(NULL);
    job=NULL;
    threadPool->moveToIdleList(this);
    if(threadPool->idleList.size()>threadPool->getAvailHighNum()){
      threadPool->deleteIdleThread(threadPool->idleList.size()-threadPool->getInitNum());
    }
    workMutex.unlock();
  }
}
void Thread::start(){}
// set & get
void Thread::setJob(Job* job,void* jobdata){
  varMutex.lock();
  this->job=job;
  this->jobData=jobdata;
  // job->setWorkThread(this);
  varMutex.unlock();
  jobCond.notify();
}
Job* Thread::getJob(void){return job;}
void Thread::setThreadPool(ThreadPool* thrPool){
  varMutex.lock();
  this->threadPool=thrPool;
  varMutex.unlock();
}
ThreadPool* Thread::getThreadPool(void){return threadPool;}
void Thread::setThreadID(unsigned long id){threadID=id;}
unsigned long Thread::getThreadID(){return threadID;}
void Thread::setThreadState(ThreadState state){threadState=state;}
ThreadState Thread::getThreadState(void){return threadState;}
void Thread::setThreadName(char* name){
  assert(NULL!=name);
  if(NULL==threadName) free(threadName);
  threadName=(char*)malloc(strlen(name)+1);
  strcpy(threadName,name);
}
char* Thread::getThreadName(void){return threadName;}
int Thread::getLastError(void){return errCode;}
