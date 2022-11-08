import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from './context/socket';

function Login() {
  const NameRef = useRef()
  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  function handleSend(e){
    console.log('handleSend called')
    let msg = NameRef.current.value
    socket.emit('name', msg);
    navigate("/lobby");
  }

  return (
    <>
        <input ref={NameRef} type="text"/>
        <button onClick={handleSend}> SEND </button>
    </>
  );
};

export default Login;