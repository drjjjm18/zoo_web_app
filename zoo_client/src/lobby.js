import { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from './context/socket';


function Lobby() {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  const [ready, setReady] = useState(false);
  const [names, setNames] = useState([]);

  socket.on('boot', () => boot());
  socket.on('start_game', () => start_game());
  socket.on('names', (names) => parseNames());

  function boot() {
    navigate("/login")
    socket.disconnect()
  }

  function start_game(){
    console.log('start_game received')
    navigate("/game")
  }

  function parseNames(names) {
   console.log(names);
  }

  function sendReady() {

    setReady(!ready);
    console.log('sendReady called')
    socket.emit('ready');
  }

  function send_server_start() {
    console.log('sending start')
    if(ready){
      socket.emit('start');
    }
    else{ return };
  }

  useEffect(() => {
      if (!socket.connected){
        navigate('/login');
  }
  });

  return (
    <div style={{  backgroundColor: '#a5b7d9', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>

      <h1>Welcome to your Lobby</h1>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px'  }}>
          <button
          onClick={sendReady}
          style={{ backgroundColor: ready ? 'green' : 'grey' }}
          > READY </button>
          <button onClick={boot}> Back to Lobby </button>
      </div>
      <button onClick={send_server_start}>START GAME</button>
    </div>
  );
};
export default Lobby;