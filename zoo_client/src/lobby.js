import { useState, useRef, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SocketContext } from './context/socket';


function Lobby() {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const location = useLocation()
  const data = location.state

  const [ready, setReady] = useState(false);
  const [names, setNames] = useState([]);
  const [newPlayer, setNewPlayer] = useState()

  socket.on('boot', () => boot());
  socket.on('start_game', () => start_game());

  function boot() {
    socket.disconnect()
    navigate("/login")
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
      } else {
         setNewPlayer(socket.auth.username)
         if (data) {
            var newData = {};
            for (let key in data){
                newData[key] = {'budget': data[key].budget, 'wins': data[key].wins}
            }
            setNames(newData);

         }
      }
  }, []);

  useEffect(() => {
    socket.on('names', (data) => {
        var newData = {};
        for (let key in data){
            newData[key] = {'budget': data[key].budget, 'wins': data[key].wins}
        }
        setNames(newData);
    })
  }, []);

  return (
    <div style={{  backgroundColor: '#a5b7d9', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
    <div style = {{position: 'absolute', left: 10 }}>
            <h5> PLAYERS</h5>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Wins</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(names).map(([name, {wins}]) => (
                  <tr key={name}>
                    <td>{name}</td>
                    <td>{wins}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>

      <h1>Welcome to your Lobby</h1>
      <h3>{newPlayer} joined the lobby!</h3>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px'  }}>
          <button
          onClick={sendReady}
          style={{ backgroundColor: ready ? 'green' : 'grey' }}
          > READY </button>
          <button onClick={boot}> Back to Login </button>
      </div>
      <button onClick={send_server_start}>START GAME</button>
      <h3> Rules </h3>
      <p> Welcome to the Zoo auction house!</p>
      <p> You $100 to bid for animals for your zoo - once its gone its gone</p>
      <p> Everyone bids in secret, a one time value of what you'll pay. Once everyone's bid is in, highest bidder wins the animal </p>
      <p> Not all animals are equal - high attraction animals like elephants are better for your zoo than low ones like Mole Rats </p>
      <p> The zoo owner with the best animal collection wins! </p>
      <h6> No animals were harmed in the making of this game </h6>
    </div>
  );
};
export default Lobby;