
class ThreadManage{
public:
  ThreadManage(){
    threadSize=10;
    threadPool=new ThreadPool(threadSize);
  }
  ThreadManage(int num){
    threadSize=num;
    threadPool=new ThreadPool(threadSize);
  }
  virtual ~ThreadManage(){
    if(NULL!=threadPool) delete threadPool;
  }
  void run(Job* job,void* jobdata){
    threadPool->run(job,jobdata);
  }
  void terminateAll(void){
    threadPool->terminateAll();
  }
private:
  ThreadPool* threadPool;
  int threadSize;
};
