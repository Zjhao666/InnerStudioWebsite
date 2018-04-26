
from requests import get, post
import json

base = 'http://localhost:8080'

def check(source, judge):
    if source != judge:
        raise Exception(source)

def query(url):
    rep = get(url)
    print(rep.text)
    check(rep.status_code, 200)

def submit(url, data):
    rep = post(url, data = data)
    print(rep.text)
    check(rep.status_code, 200)

def addTask():
    url = base + '/todaytask/add'
    data = json.dumps({
        'user': 1,
        'content': 'learning xxx',
        'endTime': '2018-10-10 12:12:12'
    })
    submit(url, data)

def getLaskWeek():
    query(base + '/todaytask/lastWeek?user=1')

def getLastMonth():
    query(base + '/todaytask/lastMonth?user=1')

def getLastThreeMonth():
    query(base + '/todaytask/lastThreeMonth?user=1')

def doCheck():
    query(base + '/today/task/check?id=20&success=true')


def validate():
    query(base + '/profile/validate?name=lijingwei&password=123456')

def uploadHeadimg():
    # ! not work: no file boundary founded
    url = base + '/profile/uploadHeadimg?user=1'
    headers = {
        'Content-Type': 'multipart/form-data'
    }
    with open('/home/luncert/Pictures/Wallpapers/body_backimg.png', 'rb') as f:
        data = f.read()
    rep = post(url, headers = headers, data = data)
    print(rep.text)

# getLaskWeek()
# getLastMonth()
# getLastThreeMonth()
# doCheck()
validate()
