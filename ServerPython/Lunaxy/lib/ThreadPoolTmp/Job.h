
class Job{
private:
  int jobNo;
  char* jobName;
  // Thread* workThread;
public:
  Job():jobNo(0),jobName(NULL){}
  // Job():workThread(NULL),jobNo(0),jobName(NULL){}
  virtual ~Job(){
    if(NULL!=jobName) free(jobName);
  }
  virtual void run(void* ptr)=0;
  void setJobNo(int jobno){this->jobNo=jobno;}
  int getJobNo(){return jobNo;}
  void setJobName(char* name){
    if(NULL!=jobName){
      free(jobName);
      jobName=NULL;
    }
    if(NULL!=name){
      jobName=(char*)malloc(strlen(name)+1);
      strcpy(jobName,name);
    }
  }
  char* getJobName(void){return jobName;}
  /*
  void setWorkThread(Thread* workThread){this->workThread=workThread;}
  Thread* getWorkThread(void){return workThread;}
  */
};
