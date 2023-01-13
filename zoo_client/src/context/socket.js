import socketio from "socket.io-client";
import React, { useState, useRef, useEffect } from 'react';

export const socket = socketio('http://localhost:1337',  { autoConnect: false });
export const SocketContext = React.createContext();