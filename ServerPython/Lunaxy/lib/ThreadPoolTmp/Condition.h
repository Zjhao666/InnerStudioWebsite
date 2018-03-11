

class Condition{
private:
  bool flag;
  std::mutex mtx;
  condition_variable cv;
public:
  Condition():flag(false){}
  void wait(){
    std::unique_lock <std::mutex> lck(mtx);
    while(!flag) cv.wait(lck);
    // reset
    flag=false;
  }
  void notify(){
    std::unique_lock <std::mutex> lck(mtx);
    flag=true;
  }
};
