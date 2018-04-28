
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

# -------------------------------------

def validate(name):
    r = get(base + '/user/validate?name=' + name + '&password=123456')
    ret = json.loads(r.text)
    return ret['data']['pass']

def getLaskWeek(user, pas):
    query(base + '/today/task/lastWeek?user=' + str(user) + '&pass=' + pas)

def getLastMonth(user, pas):
    query(base + '/today/task/lastMonth?user=' + str(user) + '&pass=' + pas)

def getLastThreeMonth(user, pas):
    query(base + '/today/task/lastThreeMonth?user=' + str(user) + '&pass=' + pas)

def addTask(user, pas):
    url = base + '/today/task/add?user=' + str(user) + '&pass=' + pas
    data = json.dumps({
        'user': user,
        'content': 'learning xxx',
        'endTime': '2018-10-10 12:12:12'
    })
    submit(url, data)

def doCheck(user, pas, task, success):
    query(base + '/today/task/check?user=' + str(user) + '&pass=' + pas + '&id=' + str(task) + '&success=' + success)


pas = validate('admin')
# getLaskWeek(1, pas)
# getLastMonth(1, pas)
# getLastThreeMonth(1, pas)
# addTask(1, pas)
# doCheck(1, pas, 31, 'true')
