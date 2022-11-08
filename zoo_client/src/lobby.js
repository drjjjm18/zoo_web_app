import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from './context/socket';


function Lobby() {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  socket.on('boot', () => boot());
  socket.on('start', () => console.log('start'))

  function boot() {
    navigate("/")
    socket.emit('changeName')
  }

  function sendReady() {
    console.log('sendReady called')
    socket.emit('ready');
  }

  return (
    <>
      <p>Welcome to your Lobby</p>
      <button onClick={sendReady}> READY </button>
      <button onClick={boot}> Back to Lobby </button>
    </>
  );
};
export default Lobby;