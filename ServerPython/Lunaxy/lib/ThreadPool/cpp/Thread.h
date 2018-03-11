
#ifndef ThreadInc
#define ThreadInc

using namespace std;
class Thread;

#include "ThreadPool.h"

class Thread{
private:
  int threadID;
  char* threadName;
  bool beSuspend;
  bool beWorking;
  bool beEnd;
  Condition cond;
  Job* job;
  thread* thr;
  ThreadPool* thrPool;
  mutex vmutex;
  mutex jobMutex;
public:
  Thread(int id);
  ~Thread();
  bool ended();
  void start();
  void suspend();
  void stop();
  void setJob(Job* job);
  void clearJob(void);
  void setThreadPool(ThreadPool* thrpool);
  int getThreadID(void);
  void setThreadName(char* name);
  char* getThreadName(void);
  static void run(Thread* handler);
};

#endif
