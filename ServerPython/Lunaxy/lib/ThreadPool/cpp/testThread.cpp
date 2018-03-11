
#include <iostream>
#include <unistd.h>
#include <stdio.h>

#include <thread>
#include <mutex>
#include <condition_variable>
#include <string.h>
#include <string>
#include "Condition.h"
#include "Job.h"
#include "Thread.h"
using namespace std;

class Test:public Job{
private:
  char* name;
public:
  Test(char* name){
    this->name=name;
  }
  void handle(void){
    printf("Job %s\n",name);
    sleep(1);
  }
};

int main(){
  char name[2]={'A','\0'};
  Job* job=new Test(name);
  Thread* thr=new Thread(0,false);
  thr->setJob(job);
  thr->start();
  cout<<1<<endl;
  sleep(1);
  thr->pause();
  cout<<2<<endl;
  sleep(1);
  thr->start();
  cout<<3<<endl;
  sleep(1);
  thr->stop();
  while(!thr->ended());
  return 0;
}
