
#pragma once

#ifndef ThreadPoolInc
#define ThreadPoolInc

using namespace std;
class ThreadPool;

#include <thread>
#include <mutex>
#include <vector>
#include <condition_variable>
#include <algorithm>
#include <unistd.h>
#include <string.h>
#include <assert.h>

#include "Condition.h"
#include "Job.h"
#include "Thread.h"
#include <iostream>

class ThreadPool{
friend class Thread;
private:
  Condition freeCond;
  std::mutex busyMutex;
  std::mutex freeMutex;
  std::mutex varMutex;
  vector<Thread*> busyList;
  vector<Thread*> freeList;
  // state args
  int tidCache;
  int blockNum;
  int maxNum;
  int availMinNum;
  Thread* getAvailableThread(void);
  void appendToFreeList(Thread* thr);
  void moveToFreeList(Thread* thr);
  void moveToBusyList(Thread* thr);
public:
  ThreadPool();
  ThreadPool(int maxnum,int availmin);
  void run(Job* job);
  void terminateAll(void);
};

#endif
