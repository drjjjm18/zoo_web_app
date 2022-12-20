import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from './context/socket';


function Lobby() {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  const [ready, setReady] = useState(false);
  const [names, setNames] = useState([]);

  socket.on('boot', () => boot());
  socket.on('start', () => console.log('start'));
  socket.on('names', (names) => parseNames());

  function boot() {
    navigate("/")
    socket.emit('changeName')
  }

  function parseNames(names) {
   console.log(names);
  }

  function sendReady() {
    setReady(!ready);
    console.log(ready)
    console.log('sendReady called')
    socket.emit('ready');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>

      <h1>Welcome to your Lobby</h1>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px'  }}>
          <button
          onClick={sendReady}
          style={{ backgroundColor: ready ? 'green' : 'grey' }}
          > READY </button>
          <button onClick={boot}> Back to Lobby </button>
      </div>
    </div>
  );
};
export default Lobby;