from requests import get
from socket import *
import json
import time

SIGN_IN = 0;
SIGN_OUT = 1;
QUERY_GROUP = 2;
CREATE_GROUP = 3;
JOIN_GROUP = 4;
MESSAGE = 5;
ACK = 6;
NAK = 7;
NOTIFY_NEWMEMBER = 8;

base = 'http://localhost:8080/'

class Message(object):
    def __init__(self, msgType, source, content = None):
        self.type = msgType
        self.source = source
        if content:
            self.contentLength = len(content)
            self.content = content
        else:
            self.contentLength = 0
            self.content = None
    def convertInt(self, sour):
        ret = bytearray()
        for i in range(4):
            ret.append(sour % 256)
            sour = int((sour - sour % 256) / 256)
        return ret
    def message(self):
        # litter Endian
        raw = bytearray()
        raw.append(self.type)
        raw.extend(self.convertInt(self.source))
        raw.extend(self.convertInt(self.contentLength))
        if self.contentLength > 0:
            raw.extend((ord(item) for item in self.content))
        return raw
    @staticmethod
    def fromConn(conn):
        def convertToInt(source, offset):
            return ord(source[offset]) + (ord(source[offset + 1]) << 8) + (ord(source[offset + 2]) << 16) + (ord(source[offset + 3]) << 24)
        count = 0
        header = ''
        while count < 9:
            tmp = conn.recv(9 - count)
            count += len(tmp)
            header += tmp
        source = convertToInt(header, 1)
        contentLength = convertToInt(header, 5)
        count = 0
        content = ''
        print(' '.join([str(ord(i)) for i in header]))
        while count < contentLength:
            tmp = conn.recv(contentLength - count)
            count += len(tmp)
            content += tmp
        print(' '.join([str(ord(i)) for i in content]))
        return Message(ord(header[0]), source, content)

# mes = Message(65, 15120, 'hi')

# validate
r = get(base + 'user/validate?name=lijingwei&password=123456')
print(r.status_code, r.text)

s = socket()
s.connect(('127.0.0.1', 10983))
s.send(Message(SIGN_IN, 4, json.loads(r.text)['data']['pass']).message())
ackMsg = Message.fromConn(s)
print(ackMsg.type, ackMsg.source, ackMsg.content)
print(ackMsg.content)

s.send(Message(QUERY_GROUP, 4).message())
ackMsg = Message.fromConn(s)
print(ackMsg.type, ackMsg.source, ackMsg.content)
print(ackMsg.content)

s.send(Message(CREATE_GROUP, 4, 'ya this is my space ya').message())
ackMsg = Message.fromConn(s)
print(ackMsg.type, ackMsg.source, ackMsg.content)
print(ackMsg.content)

s.close()
