
from BaseHTTPServer import HTTPServer,BaseHTTPRequestHandler

class HttpHandler:
    class Handler:
        def do_GET(self):
            pass
        def do_POST(self):
            pass
    def __init__(self,port):
        self.handle=HTTPServer(('',int(port)),Handler)
        self.handle.serve_forever()
