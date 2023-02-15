import { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from './context/socket';


function Game() {
  const WagerRef = useRef()
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  const [names, setNames] = useState([]);
  const [animal, setAnimal] = useState('Please wait for the next item');
  const [attraction, setAttraction] = useState('');
  const [description, setDescription] = useState('');
  const [imageSource, setImageSource] = useState('');

  const [canSubmit , setCanSubmit] = useState(true);
  socket.on('boot', () => boot());
  socket.on('notReady', () => notReady());

  useEffect(() => {
    socket.on('names', (data) => {
        var newData = {};
        for (let key in data){
            newData[key] = {'budget': data[key].budget, 'wager': data[key].wager? data[key].wager : '?'}
        }
        setNames(newData);
    })
  }, []);
  useEffect(() => {
      if (!socket.connected){
        navigate('/login');
  }
  }, []);

  useEffect(() => {
    socket.on('animal', (data) => {
        setAnimal(data.name)
        setDescription("Description: "+data.description)
        setAttraction("Attraction: "+data.attraction)
    })
  }, []);



  function boot() {
    navigate("/login")
    socket.disconnect()
  }

  function handleWager(e) {
      if (canSubmit){
       console.log(WagerRef.current.value);
       socket.emit('wager', {wager: WagerRef.current.value})
       setCanSubmit(false)
      }
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
                  <th>Wager</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(names).map(([name, {budget, wager}]) => (
                  <tr key={name}>
                    <td>{name}</td>
                    <td>{budget}</td>
                    <td>{wager}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '0px' }}>
          <h1>The Auction House</h1>
          <h3 style={{ marginTop: '50px' }}>{animal}</h3>
          <p>{attraction} </p>
          <p> {description} </p>
          <p style={{ marginTop: '100px'  }}>Enter your wager</p>
          <image src= {imageSource}></image>
          <div style={{ marginTop: '10px'  }}>
            <input ref={WagerRef} type="text"/>
            <button
            onClick={handleWager}
            style={{ backgroundColor: canSubmit ? 'green' : 'red' }}
            >
            SUBMIT WAGER
            </button>
          </div>
        </div>

    </div>
  );
};
export default Game;