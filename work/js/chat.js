
class Chat {
  constructor() {
    this.isInitiator;
    this.socket = io.connect();
    this.room = null;
  }
  
  boot() {
    this.room = prompt("Enter room name:");
    this.listen()
    if (this.room !== "") {
      console.log(`Message from client: Asking to join room ${this.room}`);
      this.socket.emit('create or join', this.room.toLowerCase());
    }
  }

  listen() {
    this.socket.on('created', (room, clientId) => {
      this.isInitiator = true;
      console.log("created")
    });
    
    this.socket.on('full', (room) => {
      console.log(`Message from client: Room ${room} is full :^(`);
    });
    
    this.socket.on('ipAddr', (ipaddr) => {
      console.log(`Message from client: Server IP address is ${ipaddr}`);
    });
    
    this.socket.on('joined', (room, clientId) => {
      this.isInitiator = false;
    });
  }
}

window.document.onreadystatechange = (e) => {
  if ( document.readyState === 'complete') {
    const chat = new Chat()
    chat.boot();
  } 
}





