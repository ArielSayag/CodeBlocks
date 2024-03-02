
const ClientConnection = require('./ClientConnection')
class Room {

  /** @type {string} */
  id

  /** @type {ClientConnection | undefined} */
  client_mentor

  /** @type {ClientConnection | undefined} */
  client_student

  constructor(roomId) {
    this.id = roomId
  }


  /** @param {ClientConnection} client  */
  addClient(client) {
    if(!this.hasMentor()) {
      this.client_mentor = client
    }else {
      this.client_student = client
    }
  }

  hasMentor() {
    return this.client_mentor !== undefined
  }

  isFull() {
    return this.client_mentor!==undefined && this.client_student !== undefined
  }

  emitMessage(ignoreId,  message) {
    if(this.client_mentor && this.client_mentor.id === ignoreId) {
      if(this.client_student)
        this.client_student.sendMessage(message)
    } else if(this.client_mentor) {
      this.client_mentor.sendMessage(message)
    }
  }
}

module.exports = Room