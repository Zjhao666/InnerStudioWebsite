
from requests import get, post
import json

base = 'http://localhost:8080/'

def check(source, judge):
    if source != judge:
        raise Exception(source)

# test Task
url = base + 'task/add'
data = json.dumps({
    'user': 1,
    'content': 'learning xxx',
    'endTime': '2018-10-10 12:12:12'
})
# r = post(url, data = data)
# check(r.status_code, 200)

# url = base + 'task/lastWeek?user=1'
# r = get(url)
# check(r.status_code, 200)
# print(r.text)