
from requests import get, post
import json

base = 'http://localhost:8080/'

def check(source, judge):
    if source != judge:
        raise Exception(source)

def query(url):
    rep = get(url)
    check(rep.status_code, 200)
    print(rep.text)

# test Task
url = base + 'task/add'
data = json.dumps({
    'user': 1,
    'content': 'learning xxx',
    'endTime': '2018-10-10 12:12:12'
})

def addTask():
    r = post(url, data = data)
    check(r.status_code, 200)

def getLaskWeek():
    query(base + 'task/lastWeek?user=1')

def getLastMonth():
    query(base + 'task/lastMonth?user=1')

def getLastThreeMonth():
    query(base + 'task/lastThreeMonth?user=1')

def doCheck():
    query(base + 'task/check?id=20&success=true')

getLaskWeek()
getLastMonth()
getLastThreeMonth()
doCheck()