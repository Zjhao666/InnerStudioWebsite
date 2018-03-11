
class Condition{
private:
  std::condition_variable cv;
  std::mutex mtx;
public:
  void wait(){
    std::unique_lock<std::mutex> lck(mtx);
    cv.wait(lck);
  }
  void notify(){
    cv.notify_one();
  }
};
