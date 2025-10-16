import { useState } from 'react'
import { useEffect } from 'react';
import './App.css'
import {GameBoard } from './components/Gameboard.tsx';


export default function App() {
  const params = new URLSearchParams(window.location.search);
  const playerSymbol = (params.get('player') === 'O' ? 'O' : 'X') as 'X' | 'O';
  const gameID = '93b0c03b-8f54-4c6f-a96f-de58300e7e17';

  return (
    <div style={{ padding: '2rem' }}>
      {gameID && <GameBoard gameId={gameID} playerSymbol={playerSymbol} />}
    </div>
  );
}
