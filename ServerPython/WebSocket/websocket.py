# Author: Johan Hanssen Seferidis
# License: MIT

import os
import re
import sys
import struct
from lib import Reflect
from base64 import b64encode
from hashlib import sha1
import hashlib
import logging
import argparse

if sys.version_info[0] < 3:
    from SocketServer import ThreadingMixIn, TCPServer, StreamRequestHandler
else:
    from socketserver import ThreadingMixIn, TCPServer, StreamRequestHandler

logger=logging.getLogger(__name__)
formatter=logging.Formatter('%(asctime)s %(levelname)-8s: %(message)s')
console_handler=logging.StreamHandler(sys.stdout)
console_handler.formatter=formatter
logger.addHandler(console_handler)

'''
+-+-+-+-+-------+-+-------------+-------------------------------+
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-------+-+-------------+-------------------------------+
|F|R|R|R| opcode|M| Payload len |    Extended payload length    |
|I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
|N|V|V|V|       |S|             |   (if payload len==126/127)   |
| |1|2|3|       |K|             |                               |
+-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
|     Extended payload length continued, if payload len == 127  |
+ - - - - - - - - - - - - - - - +-------------------------------+
|                     Payload Data continued ...                |
+---------------------------------------------------------------+
'''

FIN    = 0x80
OPCODE = 0x0f
MASKED = 0x80
PAYLOAD_LEN = 0x7f
PAYLOAD_LEN_EXT16 = 0x7e
PAYLOAD_LEN_EXT64 = 0x7f

OPCODE_CONTINUATION = 0x0
OPCODE_TEXT         = 0x1
OPCODE_BINARY       = 0x2
OPCODE_CLOSE_CONN   = 0x8
OPCODE_PING         = 0x9
OPCODE_PONG         = 0xA

class Properties(object):
    def __init__(self,param):
        object.__init__(self)
        if not isinstance(param,dict):
            raise TypeError('param must be instance of dict')
        for key,value in param.items():
            setattr(self,key,value)
    def merge(self,props):
        if not isinstance(props,Properties):
            raise TypeError('param must be instance of Properties')
        for key,value in props:
            setattr(self,key,value)
    def __iter__(self):
        for item in dir(self):
            if item.startswith('__') and item.endswith('__') or item is 'merge':
                continue
            else:
                yield (item,getattr(self,item))
    def __str__(self):
        return '[Properties instance]:\n'+'\n'.join([item[0]+':\t'+str(item[1]) for item in self])

class App(object):
    def __init__(self,appid,appname,codepath):
        self.context={}
        # load code
        self.handler=Reflect.reflect(codepath)
        if not 'urlpath' in self.handler:
            raise Exception('[App:%s] loss variable urlpath'%appname)
        if not 'onCreate' in self.handler:
            raise Exception('[App:%s] loss method create'%appname)
        if not 'onMessage' in self.handler:
            raise Exception('[App:%s] loss method onMessage'%appname)
        if not 'onDestroy' in self.handler:
            raise Exception('[App:%s] loss method onDestroy'%appname)
    def setImplement(self,im):
        self.im=im
    def handle(self,props,event):
        if props.cid in self.context:
            if event is 'message':
                self.context[props.cid].merge(props)
                self.handler['onMessage'](self.im,self.context[props.cid],self._contact)
            elif event is 'destroy':
                self.context[props.cid].merge(props)
                self.handler['onDestroy'](self.im,self.context[props.cid])
                self.context.pop(props.cid)
            else:
                logger.warning('[app] Uncaught event: %s(instance exists)'%event)
        elif event is 'create':
            if self.handler['onCreate'](self.im,props):
                self.context[props.cid]=props
                logger.info('[app] Create new instance for urlpath: %s successfully'%props.urlpath)
            else:
                logger.info('[app] App refuse to create new instance(urlpath: %s)'%props.urlpath)
        else:
            logger.warning('[app] Uncaught event: %s (instance not exists)'%event)
    def match(self,urlpath):
        return bool(self.handler['urlpath']==urlpath)
    def _contact(self,filte,data):
        for item in self.context:
            if filte(item):
                self.handler['onMessage'](self.im,item,data)
                return True
        return False

class WebSocket(ThreadingMixIn, TCPServer):
    allow_reuse_address = True
    daemon_threads = True  # comment to keep threads alive until finished
    def __init__(self, port, host, loglevel=logging.INFO):
        logger.setLevel(loglevel)
        self.port = port
        TCPServer.__init__(self, (host, port), WebSocketHandler)
        # load app
        self.apps=[]
        self.workpath=os.path.join(os.path.dirname(os.path.realpath(__file__)),'Apps')
        Reflect.setworkpath(self.workpath)
        for filename in os.listdir(self.workpath):
            codepath=os.path.join(self.workpath,filename)
            if os.path.isfile(codepath):
                self.apps.append(App(appid=len(self.apps),appname=filename,codepath=codepath))
    def setImplement(self,im):
        for item in self.apps:
            item.setImplement(im)
    def run_forever(self):
        try:
            logger.info("[manager] Listening on port %d for clients.."%self.port)
            self.serve_forever()
        except KeyboardInterrupt:
            self.server_close()
            logger.info("Server terminated.")
        except Exception as e:
            logger.error(str(e),exc_info=True)
            exit(1)
    def handle(self,props,event):
        def getCid(clientAddress):
            h=hashlib.md5()
            h.update(str(clientAddress).encode('utf-8'))
            return h.hexdigest()
        for app in self.apps:
            if app.match(props.urlpath):
                props.cid=getCid(props.clientAddress)
                app.handle(props,event)
                logger.info('[manager] Matched request: %s Cid:%s Event: %s'%(props.urlpath,props.cid,event))
                return
        logger.info('[manager] Unmatched request: %s Event: %s'%(props.urlpath,event))

class WebSocketHandler(StreamRequestHandler):
    def __init__(self, socket, addr, server):
        self.urlpath = ''
        self.server = server
        self.server.setImplement(self)
        StreamRequestHandler.__init__(self, socket, addr, server)
    def setup(self):
        StreamRequestHandler.setup(self)
        self.keep_alive = True
        self.handshake_done = False
        self.valid_client = False
    def handle(self):
        while self.keep_alive:
            if not self.handshake_done:
                self.handshake()
            elif self.valid_client:
                self.read_message()
    def read_bytes(self, num):
        # python3 gives ordinal of byte directly
        bytelist = self.rfile.read(num)
        if sys.version_info[0] < 3:
            return map(ord, bytelist)
        else:
            return bytelist
    def read_message(self):
        try:
            b1, b2 = self.read_bytes(2)
        except ValueError as e:
            b1, b2 = 0, 0

        fin    = b1 & FIN
        opcode = b1 & OPCODE
        masked = b2 & MASKED
        payload_length = b2 & PAYLOAD_LEN

        if not b1:
            logger.info("[handler] Client closed connection.")
            self.keep_alive = 0
            return
        if opcode == OPCODE_CLOSE_CONN:
            logger.info("[handler] Client asked to close connection.")
            self.keep_alive = 0
            return
        if not masked:
            logger.warn("[handler] Client must always be masked.")
            self.keep_alive = 0
            return
        # filte opcode
        if opcode == OPCODE_CONTINUATION:
            logger.warn("[handler] Continuation frames are not supported.")
            return
        elif opcode == OPCODE_BINARY:
            logger.warn("[handler] Binary frames are not supported.")
            return
        elif not opcode in [OPCODE_TEXT,OPCODE_PING,OPCODE_PONG]:
            logger.warn("[handler] Unknown opcode %#x." + opcode)
            self.keep_alive = 0
            return

        if payload_length == 126:
            payload_length = struct.unpack(">H", self.rfile.read(2))[0]
        elif payload_length == 127:
            payload_length = struct.unpack(">Q", self.rfile.read(8))[0]

        masks = self.read_bytes(4)
        decoded = ""
        for char in self.read_bytes(payload_length):
            char ^= masks[len(decoded) % 4]
            decoded += chr(char)
        if opcode == OPCODE_TEXT:
            self.server.handle(Properties({'urlpath':self.urlpath,'clientAddress':self.client_address,'message':decoded}),'message')
        elif opcode == OPCODE_PING:
            self.send_pong(decoded)
        elif opcode == OPCODE_PONG:
            pass
    def send_message(self, message):
        self.send_text(message)
    def send_pong(self, message):
        self.send_text(message, OPCODE_PONG)
    def send_text(self, message, opcode=OPCODE_TEXT):
        """
        Important: Fragmented(=continuation) messages are not supported since
        their usage cases are limited - when we don't know the payload length.
        """

        # Validate message
        if isinstance(message, bytes):
            message = try_decode_UTF8(message)  # this is slower but ensures we have UTF-8
            if not message:
                logger.warning("[handler] Can\'t send message, message is not valid UTF-8")
                return False
        elif sys.version_info < (3,0) and (isinstance(message, str) or isinstance(message, unicode)):
            pass
        elif isinstance(message, str):
            pass
        else:
            logger.warning('[handler] Can\'t send message, message has to be a string or bytes. Given type is %s' % type(message))
            return False

        header  = bytearray()
        payload = encode_to_UTF8(message)
        payload_length = len(payload)

        # Normal payload
        if payload_length <= 125:
            header.append(FIN | opcode)
            header.append(payload_length)

        # Extended payload
        elif payload_length >= 126 and payload_length <= 65535:
            header.append(FIN | opcode)
            header.append(PAYLOAD_LEN_EXT16)
            header.extend(struct.pack(">H", payload_length))

        # Huge extended payload
        elif payload_length < 18446744073709551616:
            header.append(FIN | opcode)
            header.append(PAYLOAD_LEN_EXT64)
            header.extend(struct.pack(">Q", payload_length))

        else:
            raise Exception("Message is too big. Consider breaking it into chunks.")
            return

        self.request.send(header + payload)
    def handshake(self):
        def calculate_response_key(key):
            GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
            hash = sha1(key.encode() + GUID.encode())
            response_key = b64encode(hash.digest()).strip()
            return response_key.decode('ASCII')
        def make_handshake_response(key):
            return \
              'HTTP/1.1 101 Switching Protocols\r\n'\
              'Upgrade: websocket\r\n'              \
              'Connection: Upgrade\r\n'             \
              'Sec-WebSocket-Accept: %s\r\n'        \
              '\r\n' % calculate_response_key(key)
        def resolve(http):
            return http.split(' ')[1]
        message = self.request.recv(1024).decode().strip()
        self.urlpath = resolve(message)
        upgrade = re.search('\nupgrade[\s]*:[\s]*websocket', message.lower())
        if not upgrade:
            self.keep_alive = False
            return
        key = re.search('\n[sS]ec-[wW]eb[sS]ocket-[kK]ey[\s]*:[\s]*(.*)\r\n', message)
        if key:
            key = key.group(1)
        else:
            logger.warning("[handler] Client tried to connect but was missing a key")
            self.keep_alive = False
            return
        response = make_handshake_response(key)
        self.handshake_done = self.request.send(response.encode())
        self.valid_client = True
        # create new instance
        self.server.handle(Properties({'urlpath':self.urlpath,'clientAddress':self.client_address}),'create')
    def finish(self):
        self.server.handle(Properties({'urlpath':self.urlpath,'clientAddress':self.client_address}),'destroy')
    def close(self):
        self.connection.close()

def encode_to_UTF8(data):
    try:
        return data.encode('UTF-8')
    except UnicodeEncodeError as e:
        logger.error("Could not encode data to UTF-8 -- %s" % e)
        return False
    except Exception as e:
        raise(e)
        return False

def try_decode_UTF8(data):
    try:
        return data.decode('utf-8')
    except UnicodeDecodeError:
        return False
    except Exception as e:
        raise(e)

parser=argparse.ArgumentParser()
parser.add_argument('--port','-P',required=False,type=int)
parser.add_argument('--host','-H',required=False,type=str)
parser.add_argument('--run','-R',required=False,type=str)
args=parser.parse_args()
if args.run:
    host,port=args.run.split(':')
    if not host or not port:
        raise TypeError('invalid arguments')
    websocket=WebSocket(int(port),host)
else:
    websocket=WebSocket(port=(9001 if not args.port else args.port),host=('127.0.0.1' if not args.host else args.host))
websocket.run_forever()
