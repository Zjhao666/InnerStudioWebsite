from requests import get
from socket import *
import json
import time

SIGN_OUT = 0
SIGN_IN = 1
QUERY_TEAM = 2
CREATE_TEAM = 3
JOIN_TEAM = 4
MESSAGE = 5
REP = 6
ERR = 7
NOTIFY_MEMBER_IN = 8
NOTIFY_MEMBER_OUT = 9

typeIdentity = ['SIGN_OUT', 'SIGN_IN', 'QUERY_TEAM', 'CREATE_TEAM', 'JOIN_TEAM', 'MESSAGE', 'REP', 'ERR', 'NOTIFY_MEMBER_IN', 'NOTIFY_MEMBER_OUT']

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
        for _ in range(4):
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
            header += conn.recv(9 - count)
            count = len(header)
        # print(' '.join([str(ord(i)) for i in header]))
        source = convertToInt(header, 1)
        contentLength = convertToInt(header, 5)
        count = 0
        content = ''
        while count < contentLength:
            content += conn.recv(contentLength - count)
            count = len(content)
        # print(' '.join([str(ord(i)) for i in content]))
        return Message(ord(header[0]), source, content)

class Chat(object):
    def __init__(self, id, name):
        self.id = id
        self.name = name
        self.server = socket()
        self.server.connect(('101.200.37.220', 10983))

    def getPass(self):
        r = get(base + 'user/validate?name=' + self.name + '&password=123456')
        return json.loads(r.text)['data']['pass']

    def recv(self):
        ackMsg = Message.fromConn(self.server)
        print(typeIdentity[ackMsg.type], ackMsg.source)
        print(ackMsg.content)

    def send(self, type, content = None):
        self.server.send(Message(type, self.id, content).message())

    def signIn(self, mypass):
        self.send(SIGN_IN, mypass)

    def signOut(self):
        self.send(SIGN_OUT)

    def queryTeam(self):
        self.send(QUERY_TEAM)

    def createTeam(self, name):
        self.send(CREATE_TEAM, name)

    def joinTeam(self, tid):
        self.send(JOIN_TEAM, str(tid))

    def message(self, content):
        self.send(MESSAGE, content)
