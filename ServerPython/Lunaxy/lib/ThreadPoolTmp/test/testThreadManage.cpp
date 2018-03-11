

#include <iostream>
#include <unistd.h>
#include <semaphore.h>
#include <string.h>
using namespace std;

#include <assert.h>
#include <algorithm>
#include <vector>
#include <mutex>
#include <condition_variable>
#include <thread>
#include "../Condition.h"
#include "../Job.h"
#include "../ThreadPool.h"
#include "../ThreadManage.h"


class NJob:public Job{
  void run(void* jobdata){
    cout<<"Job notification."<<endl;
    sleep(2);
  }
};

int main(){
  ThreadManage* manage=new ThreadManage(10);
  // for(int i=0;i<10;i++){
    // Job* njob=new NJob();
    // manage->run(njob,NULL);
  // }
  // sleep(4);
  // manage->terminateAll();
  return 0;
}
