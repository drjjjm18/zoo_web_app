import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from './context/socket';

function Login() {
  const NameRef = useRef()
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const [errorText, setErrorText] = useState('');

  const [connectionError, setConnectionError] = useState(false)

  socket.on('connected', (data) => enterLobby(data));
  socket.on('taken', () => takenUsername());
  socket.on('connect_error', err => handleErrors(err))
  socket.on('connect_failed', err => handleErrors(err))

  function connectToServer(e){
    let username = NameRef.current.value
    if (username === ''){
        setConnectionError(true)
        setErrorText('Please enter a username')
        return;
    }
    setErrorText('Connecting....')
    socket.auth = { username };
    socket.connect();
    setConnectionError(false)

  }

  function enterLobby(data){
    navigate("/lobby",
    {
        state: data
    })
  }

  function takenUsername(){
    console.log('taken name')
    socket.disconnect()
    setConnectionError(true)
    setErrorText(`Username taken, please choose another`)
  }

  function handleErrors(err){
    socket.disconnect()
    setConnectionError(true)
    setErrorText(`error connecting to server - please try again later`)
    console.log(err)

  }

  return (
  <div style={{  backgroundColor: '#a5b7d9'}}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
            <h1> Enter a username </h1>
            <input ref={NameRef} type="text"/>
            <button onClick={connectToServer}> ENTER </button>
        </div>
        <p  style={{ color: connectionError? 'red':'black', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        {errorText}
        </p>
  </div>
  );
};

export default Login;