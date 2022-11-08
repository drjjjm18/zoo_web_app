import socketio from "socket.io-client";
import React, { useState, useRef, useEffect } from 'react';

export const socket = socketio.connect('http://localhost:1337');
export const SocketContext = React.createContext();