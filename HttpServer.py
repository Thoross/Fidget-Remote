'''
    Copyright (c) 2013 Brendan Betts
    Created by: Brendan Betts (brendan.betts@live.com)
    Created on 9/29/13
'''

import SimpleHTTPServer
import SocketServer

PORT = 4567

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

httpd = SocketServer.TCPServer(("",PORT), Handler)

print "Serving on port ", PORT
httpd.serve_forever()