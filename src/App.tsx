import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Lobby } from './components/Lobby';
import { GameBoard } from './components/Gameboard';

export const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Lobby />} />
      <Route path="/game/:gameId" element={<GameBoard />} />
    </Routes>
  </Router>
);
