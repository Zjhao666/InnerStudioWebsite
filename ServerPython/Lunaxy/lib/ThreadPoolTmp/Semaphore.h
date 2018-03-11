

class Semaphore {
public:
  Semaphore(long count=0):count(count){}
  void signal(){
    mtx.lock();
    // return a lock
    count++;
    // notify condition_variable
    cond.notify();
  }
  void wait(){
    mtx.lock();
    // wait for a lock
    while(count<=0) cond.wait();
    // take a lock
    count--;
  }
private:
  std::mutex mtx;;
  Condition cond;
  long count;
};
