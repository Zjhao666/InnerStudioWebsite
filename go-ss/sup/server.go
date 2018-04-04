
package sup

import (
  "os"
  "strings"
  "strconv"
)

func Server(cfg Config) {
  Info(cfg.PortPassword)
}

const logCntDelta = 100
var connCnt int
var nextLogConnCnt int = logCntDelta

func resolve(raw string, key string)(ret string) {
  i := strings.Index(raw,key)+8
  ret = raw[i:]
  i = strings.Index(tmp, "\n")
  ret = strings.TrimSpace(tmp[:i])
}
func handleConnection(conn int, port int, key string) {
	connCnt++
	if connCnt-nextLogConnCnt >= 0 {
    Info("number of client connections reaches: ",nextLogConnCnt)
		nextLogConnCnt += logCntDelta
	}
  Info("new client ", sanitizeAddr(conn.RemoteAddr())," -> ", conn.LocalAddr())

  conn.SetReadDeadline(time.Now().Add(time.Minute * 3))
  defer conn.Close()
  data := make([]byte],1024)
  n,err :=conn.Read(data)
  if n==0 || err != nil {
    Error(err)
  } else {
    raw := string(data)
    // PortSet
    portSet := strconv.Atoi(resolve(raw, "PortSet"))
    if portSet==port {
      host := resolve(raw,"Host")
      for
    } else {
      Error("illegal PortSet: ",tmp)
    }
  }
}

func run(port, key string) {
	ln, err := net.Listen("tcp", "0.0.0.0:"+port)
	if err != nil {
    Fatal("error listening port ",port," : ",err)
		os.Exit(1)
	}
  Info("server listening port ",port)
	for {
		conn, err := ln.Accept()
		if err != nil {
      Fatal("accept error: ",err)
			return
		}
		go handleConnection(conn, key)
	}
}
