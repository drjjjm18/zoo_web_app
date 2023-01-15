import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from './context/socket';


function Game() {
  const WagerRef = useRef()
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  const [names, setNames] = useState([]);
  const [animal, setAnimal] = useState('animal');
  const canSubmit = false;
//  socket.on('boot', () => boot());
  socket.on('notReady', () => notReady());
  socket.onmessage = function (event) {

    switch (event.data[0])
    {
        case "names" :
            setNames(event.data)
            console.log(names)
        break;
        case "animal" :
            console.log(event.data)
        break;
    }
};

  function boot() {
    navigate("/login")
    socket.disconnect()
  }

  function handleWager(e) {
   console.log(e);
  }

  function notReady(){
    console.log('not ready')
    alert('Not all players Ready')
  }


  return (
    <div style={{  backgroundColor: '#a5b7d9', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
         <div style = {{position: 'absolute', left: 10 }}>
            <h5> PLAYERS</h5>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Budget</th>
                </tr>
              </thead>
              <tbody>
                {names.map((item) => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td>{item.budget}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '0px' }}>
          <h1>The Auction House</h1>
          <h5  style={{ marginTop: '50px' }}>{animal}</h5>
          <p style={{ marginTop: '100px'  }}>Enter your wager</p>
          <div style={{ marginTop: '10px'  }}>
            <input ref={WagerRef} type="text"/>
            <button
            onClick={handleWager}
            style={{ backgroundColor: canSubmit ? 'green' : 'grey' }}
            >
            SUBMIT WAGER
            </button>
          </div>
        </div>

    </div>
  );
};
export default Game;