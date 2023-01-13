import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from './context/socket';

function Login() {
  const NameRef = useRef()
  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  socket.on('connected', () => enterLobby());

  function connectToServer(e){
    console.log('handleSend called')
    let username = NameRef.current.value
    socket.auth = { username };
    socket.connect();
  }

  function enterLobby(){
    navigate("/lobby")
  }

  return (
    <div style={{  backgroundColor: '#a5b7d9', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
        <h1> Enter your Name </h1>
        <input ref={NameRef} type="text"/>
        <button onClick={connectToServer}> ENTER </button>
    </div>
  );
};

export default Login;