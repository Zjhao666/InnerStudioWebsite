
package sup

import (
  "log"
)
type T interface {}

func Info(msg T) {
  print("-> ")
  log.Println(msg)
}
func Error(msg T) {
  print("* ")
  log.Println(msg)
}
func Fatal(msg T) {
  print("! ")
  log.Println(msg)
}
