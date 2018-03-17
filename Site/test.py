import requests
import json

base='http://localhost:8081/'

# rep=requests.get(base+'document/open?target=/home/lijingwei/github')
rep=requests.get(base+'member/getMembers')
data=json.loads(rep.text)
print(data[0])
