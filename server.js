const { createServer } = require('http')
const { Server } = require('socket.io')
const animals = require('./animals')

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
})

players = {}
names = []
remainingAnimals = []
currentAnimal = {};

io.on('connection', function (socket) {

  console.log('new connection');
  const username = socket.handshake.auth.username;
  if (username in players) {
  console.log('taken username')
    socket.emit('taken')
  }
  else {
      players[username] = {'name': username, 'ready': false, 'budget': 100, 'animals': [], wager: false, wins: 0}
      socket.username = username
      console.log(players)
      socket.emit('connected', players)
      io.emit('names', players)
  }

  socket.on('disconnect', () => {
    names = names.filter(item => item !== players[socket.username].name)

    delete players[socket.username]
    console.log('user disconnected');
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
        setTimeout(setUpGame, 100);
    }
  });

  function setUpGame(){
    remainingAnimals = JSON.parse(JSON.stringify(animals));
    io.emit('names', players);
    nextRound();
  }

  function getAnimal(){
    let index = Math.floor(Math.random() * remainingAnimals.length);
    let removedItem = remainingAnimals.splice(index, 1)[0];
    return removedItem;
  }
  socket.on('sendNames', () => {
    io.emit('names', players)
    io.emit('animal', getAnimal())
  });

  socket.on('wager', (wager) => {
  io.emit('names', players)
    players[socket.username].wager = wager
    var all_ready = true;
    for (const key in players) {
        if (players[key].wager == false) {
           console.log('not all players ready')
           all_ready = false;
        }
    }
    if (all_ready){
      io.emit('wagers', players);
    }
  });

  function handleRound(){
    io.emit('wagers', players);
    var highestBidders = [];
    var highestBid = -Infinity;
    for (const key in players) {
        const wagerValue = players[key].wager;
        if (wagerValue >= highestBid) {
          highestBid = wagerValue;
          highestBidders.push(key)
        }
    }
    if (highestBidders.length>1){
        io.emit('draw');
    } else {
        var winner = highestBidders[0];
        io.emit('winner', winner);
        players[winner].budget = players[winner].budget - highestBid;
        players[winner].animals.push(currentAnimal);
    }
  }
  function nextRound(){
    if (remainingAnimals.length === 0){
        finishGame();
    }
    else {
        setWagersFalse();
        currentAnimal = getAnimal();
        io.emit('animal', currentAnimal);
    }
  }
  function setWagersFalse(){
    for (const key in players){
        players[key].wager = false;
    }
  }
});


//reset()
const port = 1337
httpServer.listen(port)
console.log('Listening on port ' + port + '...')

