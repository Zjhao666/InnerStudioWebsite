
package main

import (
  "fmt"
  "path/filepath"
  "path"
  "os"
  "github.com/akamensky/argparse"
  ss "./sup"
)

func PathExists(path string) bool {
  _, err := os.Stat(path)
  if err == nil {
    return true
  }
  if os.IsNotExist(err) {
    return false
  }
 return false
}
func main(){
  parser := argparse.NewParser("shadowsocks-go","faster!")
  pconfigPath := parser.String("c","config",&argparse.Options{Required: true, Help: "path of config file"})
  err := parser.Parse(os.Args)
  if err != nil {
    fmt.Print(parser.Usage(err))
    return
  }
  // set config path
  configPath := *pconfigPath
  if path.Base(configPath)==configPath {
    baseDir,_ := filepath.Abs(filepath.Dir(os.Args[0]))
    configPath = path.Join(baseDir,configPath)
  }
  if PathExists(configPath) {
    config,err := ss.ParseConfig(configPath)
    if err!=nil {
      ss.Fatal(err)
      return
    }
    // ss.Client(config)
    ss.Server(config)
  } else {
    println("! configure file path not exits: ",configPath)
  }
}
