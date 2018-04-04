
package sup

import (
	"encoding/json"
	"io/ioutil"
	"os"
	// "strings"
	"time"
)

type Config struct {
	Server       interface{} `json:"server"`
	ServerPort   int         `json:"server_port"`
	LocalPort    int         `json:"local_port"`
	LocalAddress string      `json:"local_address"`
	Password     string      `json:"password"`
	// Method       string      `json:"method"` // encryption method
	Auth         bool        `json:"auth"`   // one time auth

	// following options are only used by server
	PortPassword map[string]string `json:"port_password"`
	// Timeout      int               `json:"timeout"`

	// following options are only used by client

	// The order of servers in the client config is significant, so use array
	// instead of map to preserve the order.
	ServerPassword [][]string `json:"server_password"`
}

var readTimeout time.Duration

func ParseConfig(path string) (config Config, err error) {
	file, err := os.Open(path) // For read access.
	if err != nil {
		return
	}
	defer file.Close()

	data, err := ioutil.ReadAll(file)
	if err != nil {
		return
	}

	config = Config{}
	if err = json.Unmarshal(data, &config); err != nil {
		return
	}
	readTimeout = time.Duration(config.Timeout) * time.Second
	// if strings.HasSuffix(strings.ToLower(config.Method), "-auth") {
	// 	config.Method = config.Method[:len(config.Method)-5]
	// 	config.Auth = true
	// }
	return
}
