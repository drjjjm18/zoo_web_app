import React from 'react';
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./login";
import Lobby from "./lobby";
import Game from "./game";
import {SocketContext, socket} from './context/socket';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SocketContext.Provider value={socket}>
        <BrowserRouter>
            <Routes>
                <Route index element={<Login />} />
                <Route path="lobby" element={<Lobby />} />
                <Route path="game" element={<Game />} />
            </Routes>
        </BrowserRouter>
    </SocketContext.Provider>
  </React.StrictMode>
);

