const { createServer } = require('http')
const { Server } = require('socket.io')

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
})

//import { Server } from "socket.io";
//const port = 1337;
//const io = new Server(port);
//console.log('Listening on port ' + port + '...');

players = {}
names = []

io.on('connection', function (socket) {

  console.log('new connection');
  players[socket] = {'name': '', 'ready': false, 'animals': []};

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('name', (name)=> {
    players[socket]['name'] = name
    names.push(name)
    console.log(names)
    io.emit('names: '+ names.toString())
  });

  socket.on('changeName', (name)=> {
    players[socket] = {'name': '', 'ready': false, 'animals': []};
  });

  socket.on('ready', ()=> {
    if (players[socket]['name']=='') {
        console.log('sending boot')
        socket.emit('boot')
    }
    else {
        players[socket]['ready'] = !players[socket]['ready']
        console.log(players[socket])
        const all_ready = true;
        for (const obj in players) {
            if (obj['ready'] == false) {
               all_ready = false;
            }
        }
        if (all_ready) {
            io.emit('start')
        }
    };
  });

  function setUpGame(){
    io.emit(concat(['names'], names))
  }

});


//reset()
const port = 1337
httpServer.listen(port)
console.log('Listening on port ' + port + '...')

