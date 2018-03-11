
from ThreadPool import ThreadPool
from socket import *
import time

class Job:
    def __init__(self,client,addr):
        self.client=client
        self.addr=addr
    def handle(self):
        print(addr)
    def __del__(self):
        self.client.close()

tp=ThreadPool()
server=socket()
server.bind(('0.0.0.0',42800))
server.listen(100)
for i in range(3):
    client,addr=server.accept()
    tp.run(Job(client,addr))
server.close();
tp.terminateAll()
