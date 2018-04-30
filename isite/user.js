
let net = require('net');

// !bug
const Socket = net.Socket;

const PORT = 10983;
const HOST = '101.200.37.220';

const SIGN_OUT = 0;
const SIGN_IN = 1;
const QUERY_TEAM = 2;
const CREATE_TEAM = 3;
const JOIN_TEAM = 4;
const MESSAGE = 5;
const REP = 6;
const ERR = 7;
const NOTIFY_MEMBER_IN = 8;
const NOTIFY_MEMBER_OUT = 9;

const typeIdentity = ['SIGN_OUT', 'SIGN_IN', 'QUERY_TEAM', 'CREATE_TEAM', 'JOIN_TEAM', 'MESSAGE', 'REP', 'ERR', 'NOTIFY_MEMBER_IN', 'NOTIFY_MEMBER_OUT'];


Buffer.prototype.toByteArray = function() { return Array.prototype.slice.call(this, 0); }

class Message {
  constructor(type, source, content) {
    this.type = type;
    this.source = source;
    if (content) {
      this.content = new Buffer(content); // .utf8Slice();
      this.contentLength = this.content.length;
    } else {
      this.contentLength = 0;
      this.content = null;
    }
  }
  message() {
    const writeInt = (n) => {
      for (let i = 0; i < 4; i++) {
        bytes.push(n % 256);
        n = parseInt((n - n % 256) / 256);
      }
    };
    let bytes = [];
    bytes.push(this.type);
    writeInt(this.source);
    writeInt(this.contentLength);
    if (this.content) new Buffer(this.content).toByteArray().forEach((item) => bytes.push(item));
    return new Buffer(bytes);
  }
}

class User {
  constructor(id, pass, password, onTeamInfo, onTeamHistory) {
    this.id = id;
    this.pass = pass;
    this.password = password;
    this.name = null;
    // set callback to submit data to view
    this.onTeamInfo = onTeamInfo;
    this.onTeamHistory = onTeamHistory;
    this.requireQueue = [];
    this.listener = {
      message: null,
      memberIn: null,
      memberOut: null
    };
    this.connect();
  }
  send(type, content) {
    this.conn.write(new Message(type, this.id, content).message());
  }
  addRequire(callback) {
    this.requireQueue.push(callback);
  }
  msgHandle(msg) {
    switch(msg.type) {
      case REP:
        if (this.requireQueue.length > 0) {
          this.requireQueue.shift()(msg);
        } else; // ignore
        break;
      case ERR:
        console.log('error: ', msg);
        break;
      case NOTIFY_MEMBER_IN:
        if (this.listener.memberIn) this.listener.memberIn(msg);
        break;
      case NOTIFY_MEMBER_OUT:
        if (this.listener.memberOut) this.listener.memberOut(msg);
        break;
      case MESSAGE:
        if (this.listener.message) this.listener.message(msg);
        break;
      default:
        console.log(msg);
    }
  }
  connect() {
    const bytesToInt = (source, offset) => {
      return source[offset] + (source[offset + 1] << 8) + (source[offset + 2] << 16) + (source[offset + 3] << 24);
    };
    const recvWrapper = () => {
      const STEP_TYPE = 0, STEP_SOURCE = 1, STEP_CONTENG_LENGTH = 2, STEP_CONTENT = 3, STEP_NUM = 4;
      const step_byte_num = [1, 4, 4];
      let stepCounter = STEP_TYPE;
      let byteCounter = step_byte_num[stepCounter];
      let msgbuf = [];
      // return callback
      return (data) => {
        let dataBuf = new Buffer(data);
        let size = dataBuf.length, nxtSize = 0;
        while (size > 0) {
          nxtSize = size - byteCounter;
          if (nxtSize >= 0) {
            // copy bytes into buf
            for (let i = 0, offset = dataBuf.length - size; i < byteCounter; i++) msgbuf.push(dataBuf[i + offset]);
            // change to next step
            stepCounter = (stepCounter + 1) % STEP_NUM;
            if (stepCounter == STEP_TYPE) {
              // finished reading a message
              this.msgHandle(new Message(msgbuf[0], bytesToInt(msgbuf, 1), msgbuf.slice(9, msgbuf.length)));
              msgbuf = [];
            }
            if (stepCounter == STEP_CONTENT) {
              byteCounter = bytesToInt(msgbuf, msgbuf.length - 4);
              // finish this message's recv because there is no more bytes
              if (byteCounter == 0) {
                stepCounter = STEP_TYPE;
                byteCounter = step_byte_num[stepCounter];
                this.msgHandle(new Message(msgbuf[0], bytesToInt(msgbuf, 1), msgbuf.slice(9, msgbuf.length)));
                msgbuf = [];
              }
            }
            else byteCounter = step_byte_num[stepCounter];
          }
          else {
            for (let i = 0, offset = dataBuf.length - size; i < size; i++) msgbuf.push(dataBuf[i + offset]);
            byteCounter = 0 - nxtSize;
          }
          size = nxtSize;
        }
      };
    };
    let conn = this.conn = new Socket();
    conn.connect(PORT, HOST, () => {
      // after connection established
      this.signIn((msg) => {
        this.name = msg.content.utf8Slice();
        this.queryTeam((msg) => {
          this.onTeamInfo(msg.content);
          // join team: 'Mobile AI'
          this.joinTeam(1, this.onTeamHistory);
        });
      });
    });
    conn.on('data', recvWrapper());
  }
  /* api */
  on(event, callback) {
    if (this.listener[event] == null) this.listener[event] = callback;
    else throw new Error('invalid event: ' + event);
  }
  // response with random name
  signIn(onReady) {
    this.send(SIGN_IN, this.pass);
    this.addRequire(onReady);
  }
  // response with team info
  queryTeam(onReady) {
    this.send(QUERY_TEAM);
    this.addRequire(onReady);
  }
  // response with ERR or REP
  createTeam(name, onReady) {
    this.send(CREATE_TEAM, name);
    this.addRequire(onReady);
  }
  // response with team history
  joinTeam(id, onReady) {
    this.send(JOIN_TEAM, id.toString());
    this.addRequire(onReady);
  }
  // no response
  message(content) {
    this.send(MESSAGE, content);
  }
  // no response
  signOut() {
    this.send(SIGN_OUT);
    this.conn.destroy();
  }
}

module.exports = {
  User: User
};
