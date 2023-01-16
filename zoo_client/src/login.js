import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from './context/socket';

function Login() {
  const NameRef = useRef()
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const [errorText, setErrorText] = useState('');

  socket.on('connected', () => enterLobby());
  socket.on('taken', () => takenUsername());

  function connectToServer(e){
    let username = NameRef.current.value
    if (username === ''){
        setErrorText('Please enter a username')
        return;
    }
    socket.auth = { username };
    socket.connect();
  }

  function enterLobby(){
    navigate("/lobby")
  }

  function takenUsername(){
    socket.disconnect()
    setErrorText(`Username '${NameRef.current.value}' taken, please choose another`)
  }

  return (
  <div style={{  backgroundColor: '#a5b7d9'}}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
            <h1> Enter a username </h1>
            <input ref={NameRef} type="text"/>
            <button onClick={connectToServer}> ENTER </button>
        </div>
        <p  style={{ color: 'red', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        {errorText}
        </p>
  </div>
  );
};

export default Login;