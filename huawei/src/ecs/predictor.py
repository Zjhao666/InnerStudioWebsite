import time
import math

def predict_vm(ecs_lines, input_lines):
    def convertTime(t):
        return time.mktime(time.strptime(t.replace('-',' ').replace(':',' ').replace('\n','').replace('\r',''),"%Y %m %d %H %M %S"))
    def normal_distribution(x, u, sig):
        return math.exp(-(x - u) ** 2 /(2* sig **2))/(math.sqrt(2*math.pi)*sig)
    # Do your work from here#
    u = 0
    sig = math.sqrt(0.0001)

    result = []
    if ecs_lines is None:
        print 'ecs information is none'
        return result
    if input_lines is None:
        print 'input file information is none'
        return result
    # translate datetime to timestamp,then calculate weight with [normal_distribution]
    currentTime=convertTime('2015 2 20 0 0 0')
    timeArray=[convertTime(item.split('\t')[2]) for item in ecs_lines]
    # normal to 0
    timeMin=min(timeArray)
    timeRange=currentTime-timeMin
    timeArray=[(item-timeMin)/timeRange-1 for item in timeArray]
    weight=[normal_distribution(t,u,sig) for t in timeArray]
    # normal to 1
    weightSum=sum(weight)
    weight=[item/weightSum for item in weight]
    # handle
    return result
