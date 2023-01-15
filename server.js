const { createServer } = require('http')
const { Server } = require('socket.io')

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
})

players = {}
names = []

io.on('connection', function (socket) {

  console.log('new connection');
  const username = socket.handshake.auth.username;
  players[username] = {'name': username, 'ready': false, 'animals': []}
  socket.username = username
  console.log(players)
  console.log('sending connected')
  socket.emit('connected')

  socket.on('disconnect', () => {
    names = names.filter(item => item !== players[socket.username].name)

    delete players[socket.username]
    console.log('user disconnected', players);
  });



  socket.on('ready', ()=> {
    if (players[socket.username]['name']=='') {
        console.log('sending boot')
        socket.emit('boot')
    }
    else {
        players[socket.username]['ready'] = !players[socket.username]['ready']
        console.log(players[socket.username])

    };
  });

  socket.on('start', () => {
    console.log('start called')
    var all_ready = true;
    for (const key in players) {

        if (players[key].ready == false) {
           console.log('not all players ready')
           all_ready = false;
        }
    }
    if (all_ready) {
        io.emit('start_game')
    }
  });

  function setUpGame(){
    io.emit(concat(['names'], names))
  }

});


//reset()
const port = 1337
httpServer.listen(port)
console.log('Listening on port ' + port + '...')

