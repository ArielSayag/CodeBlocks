
const {WebSocket} = require('ws')
const ClientConnection = require('./ClientConnection')
const Room = require('./Room')

class CodeBlocksManager {

  /** @type {Map<string, ClientConnection>}*/
  clients = new Map()

  /** @type {Map<string, Room>}*/
  rooms = new Map()

  /** @param {WebSocket} socket */
   addClient(socket) {
    const connection = new ClientConnection(socket)
    this.clients.set( connection.id, connection);
    return connection
  }

   /** @param {string} clientId */
   removeClient(clientId) {
    console.log("Leaving 0")
    const client = this.clients.get(clientId)
    if(!client) return false
    client.leave(false) // do not leave room before checking if it exists
    if(client.room) {
        this.leaveRoom(clientId, client.room)
    }
    this.clients.delete(clientId);
    return true;
  }

   /**
    * @param {string} clientId  
    * @param {string} roomId  
   */
  joinRoom(clientId, roomId) {
    const client = this.clients.get(clientId)
    if(!client) {
      return false;   
    }
    let room = this.rooms.get(roomId)

    if(!room) { // mentor join
      room = new Room(roomId)
      room.addClient(client)
      client.sendMessage("USER_TYPE:MENTOR")
      this.rooms.set(roomId, room)
    } else if(room.isFull()) { // unknown intruder
      client.sendMessage("ROOM_FULL:")
    } else { //  student join
      room.emitMessage(clientId, "STUDENT_JOIN:")
      client.sendMessage("USER_TYPE:STUDENT")
      room.addClient(client)
    }
    return true;
  }


   /**
    * @param {string} clientId  
    * @param {string} codeUpdate  
   */
  updateCode(clientId, codeUpdate) {
    
    const client = this.clients.get(clientId)
    console.log("Client code update?")
    if(!client || !client.room) return false // cannot code update
    console.log("Client exists?")
    let room = this.rooms.get(client.room)
    console.log("Client room exists?")
    if(!room) return false
    console.log("Emitting message to room")
    room.emitMessage(clientId, `CODE_UPDATE:${codeUpdate}`)
    return true;
  }

  leaveRoom(clientId, roomId) {
    const client = this.clients.get(clientId)
    if(!client) return false
    let room = this.rooms.get(roomId)
    if(!room) return false
    client.leaveRoom()
    if(room.hasMentor() && room.client_mentor.id === clientId) {
        room.emitMessage(clientId, "CLOSE_ROOM:")
        this.rooms.delete(roomId)
    } else if(room.hasMentor()) {
       room.emitMessage(room.client_student, "STUDENT_LEAVE:")
       room.client_student = undefined
    }
    return true;
  }

  
  /** @param {WebSocket} socket*/
  handleConnection(socket) {
  
    const client = this.addClient(socket)
    socket.on('message', (message) => {
      const [cmd, data] = message.toString('utf-8').split(":") // joinRoom:3
        console.log(message.toString('utf-8'))

        switch(cmd) {
          case "JOIN_ROOM":
            client.joinRoom(data)
            this.joinRoom(client.id, data)
            break;
            
          case "LEAVE_ROOM":
             client.leaveRoom()
             this.leaveRoom(client.id, data)
            break;
          case "CODE_UPDATE":
             this.updateCode(client.id, data)
            break;
        }
    })

    socket.on('close', () => {
      this.removeClient(client.id)
    })
    
  }

}


module.exports = CodeBlocksManager