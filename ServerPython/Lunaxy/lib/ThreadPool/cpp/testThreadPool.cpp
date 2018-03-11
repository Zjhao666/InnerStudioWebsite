

#include "ThreadPool.h"
#include <iostream>
using namespace std;

class Jtest:public Job{
private:
  int jid;
public:
  Jtest(int id):jid(id){}
  void handle(void){
    cout<<(char)(jid+97)<<endl;
    sleep(1);
  }
};

int main(){
  ThreadPool* tp=new ThreadPool();
  for(int i=0;i<10;i++){
    Jtest* job=new Jtest(i);
    tp->run(job);
  }
  sleep(2);
  tp->terminateAll();
  return 0;
}
