
const {WebSocket} = require('ws')
const { v4 } = require('uuid')
class ClientConnection {
  /** @type {WebSocket}  */
  socket
  /** @type {string} */
  id

  /** @type {string | undefined} */
  room
  /** @type {boolean} */
  connected

  /** @param {WebSocket} socket */
  constructor(socket) {
    this.socket = socket
    this.id = v4()
    this.connected = true
  }


  /**@param {string} msg */
  sendMessage(msg) {
    if(this.connected) {
      this.socket.send(msg)
    }
  }

  joinRoom(roomId) {
    this.room = roomId
  }

  leaveRoom() {
    this.room = undefined
  }

  leave(leaveRoom = true) {
    if(leaveRoom)
      this.leaveRoom()
    this.connected = false
  }

}

module.exports = ClientConnection