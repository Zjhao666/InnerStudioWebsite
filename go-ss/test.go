
package main

import "strconv"
import "strings"

func main(){
  s := "8388\r"
  n,_ := strconv.Atoi(strings.TrimSpace(s))
  s := n
  println(s)
}
