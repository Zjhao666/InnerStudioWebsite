
import sys
import logging
import argparse
from ctypes import cdll

if sys.version_info[0] < 3:
    from SocketServer import ThreadingMixIn, TCPServer, StreamRequestHandler
else:
    from socketserver import ThreadingMixIn, TCPServer, StreamRequestHandler

logger=logging.getLogger(__name__)
formatter=logging.Formatter('%(asctime)s %(levelname)-8s: %(message)s')
console_handler=logging.StreamHandler(sys.stdout)
console_handler.formatter=formatter
logger.addHandler(console_handler)

class RequestHandler(StreamRequestHandler):
    HTTP=cdll.LoadLibrary('')
    def __init__(self,socket,addr,server):
        self.socket=socket
        StreamRequestHandler.__init__(self,socket,addr,server)
    def handle(self):
        pass

class Core(ThreadingMixIn,TCPServer):
    def __init__(self,host,port,loglevel=logging.INFO):
        logger.setLevel(loglevel)
        self.host=host
        self.port=port
        TCPServer.__init__(self,(host,port),RequestHandler)
    def run(self):
        try:
            logger.info("Listening on %s:%d for clients.."%(self.host,self.port))
            self.serve_forever()
        except KeyboardInterrupt:
            self.server_close()
            logger.info("Server terminated.")
        except Exception as e:
            logger.error(str(e),exc_info=True)
            exit(1)
