import requests
rep=requests.post(url='http://localhost:8081/login/regis')
print(rep)
print(rep.text)
