import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {client } from '../amplifyClient';
import Confetti from 'react-confetti';
import { Square } from './Square';
import { getRole } from '../utils/player';
import { useNavigate } from 'react-router-dom';

export const GameBoard: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [game, setGame] = useState<any>(null);
  const [playerSymbol, setPlayerSymbol] = useState<'X' | 'O'>('X');
  const navigate = useNavigate()
  // Fetch game and subscribe
  useEffect(() => {
    if (!gameId) return;
    //const pid = getPlayerId();
    const role = getRole(gameId);
    const fetchGame = async () => {
      const result = await client.models.Game.get({ id: gameId });
      setGame(result.data ?? null);

      if(role === 'X') setPlayerSymbol('X');
      else if(role === 'O') setPlayerSymbol('O');
      else {
        alert("You haven't joined this game yet. Returning to lobby.");
        navigate("/");
      }
    };

    fetchGame();

    const subscription = client.models.Game.onUpdate({ filter: { id: { eq: gameId } } }).subscribe({
      next: (updatedGame) => setGame(updatedGame ?? null),
      error: (err) => console.error(err),
    });

    return () => subscription.unsubscribe();
  }, [gameId]);

  const handleClick = async (index: number) => {
    if (!game || game.winner || game.currentTurn !== playerSymbol || game.board[index]) return;

    const updatedBoard = [...game.board];
    updatedBoard[index] = playerSymbol;

    const winner = calculateWinner(updatedBoard);
    const nextTurn = playerSymbol === 'X' ? 'O' : 'X';

    await client.models.Game.update({
      id: gameId!,
      board: updatedBoard,
      currentTurn: winner ? null : nextTurn,
      winner: winner ?? null,
    });
  };

   const handleQuit = async () => {
    const confirmQuit = window.confirm('Are you sure you want to quit and delete this game?');
    if (!confirmQuit) return;
    try{
      await client.models.Game.delete({ id: gameId! });
      navigate("/");
    } catch (error) {
      console.error('[Gameboard] quit:error', error);
    }
   };

  const calculateWinner = (board: (string | null)[]) => {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (let [a,b,c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    if (board.every(cell => cell !== null)) return 'Tie';
    return null;
  };

  if (!game) return <p>Loading game...</p>;
  const playerXColor = (playerSymbol === 'X') ? '#1859adff' : 'inherit';
  const playerOColor = (playerSymbol === 'O') ? '#9a18a5ff' : 'inherit';

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh' }}>
      <h2>
        <span style={{color:playerXColor}}>{game.playerX}</span> 
        <span> vs </span>
        <span style={{color:playerOColor}}>{game.playerO ?? 'Waiting for Player O'}</span>
    </h2>
      
      {game.winner ? (
          game.winner === 'Tie' ? (
            <p style={{ fontWeight: 'bold' }}>Tie 🐱</p>
          ) : (
            <p style={{ color: '#388e3c', fontWeight: 'bold' }}>Winner: {game.winner} 🎉</p>
            )
          ) : (
            <p>Turn: {game.currentTurn}</p>
        )}
        {(game.winner == 'X' || game.winner == "O") && <Confetti />}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        maxWidth: '280px',
        margin: '1rem auto'
      }}>
        {game.board.map((value: string | null, idx: number) => (
          <Square key={idx} value={value} onClick={() => handleClick(idx)} />
        ))}
      </div>
      {game.winner && (
  <button
    style={{
      marginTop: '1rem',
      padding: '0.5rem 1rem',
      fontSize: '1rem',
      backgroundColor: '#1976d2',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    }}
    onClick={async () => {
      if (!gameId) return;

      const emptyBoard = Array(9).fill(null);
      await client.models.Game.update({
        id: gameId,
        board: emptyBoard,
        currentTurn: 'X',
        winner: null,
      });

      setGame({
        ...game,
        board: emptyBoard,
        currentTurn: 'X',
        winner: null,
      });
    }}
  >
    Play Again
  </button>
)}
  <button style={{ 
      marginTop: '1rem',
      padding: '0.5rem 1rem',
      fontSize: '1rem',
      backgroundColor: '#1976d2',
      color: 'white',
      border: 'none',
      borderRadius: '5px', 
      cursor: 'pointer' }}
      onClick={handleQuit}>Back to Lobby</button>
    </div>
  );
};
