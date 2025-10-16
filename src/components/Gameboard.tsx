
import React, { useEffect, useState } from 'react';
import {Square}  from './Square';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { client } from '../amplifyClient';
import type { Schema } from '../../amplify/data/resource';

interface GameBoardProps {
  gameId: string;
  playerSymbol: 'X' | 'O';
}


export const GameBoard: React.FC<GameBoardProps> = ({gameId, playerSymbol}) => {
   
    const [game, setGame] = useState<any>(null);

    const fetchGame = async() =>{
        try{
            console.log('Fetching game with ID:', gameId);
            const result = await client.models.Game.get({id: gameId});
            console.log('Result from backend:', result);
            setGame(result.data ?? null);
        } catch (err){
            console.error('Error fetching game:', err);
        }
    };

    useEffect(() => {
        if (!gameId) return;
        fetchGame();
      
        const subscription = client.models.Game.onUpdate({ filter: { id: { eq: gameId } } }).subscribe({
            next: (game) => {
            setGame(game ?? null);
            },
            error: (err) => console.error('Subscription error:', err),
        });
        return () => subscription.unsubscribe();
    }, [gameId]);
    if (!game) return <div>Loading game...</div>;

    const handleClick = (index: number) => {
        if (game.board?.[index] || game.currentTurn !== playerSymbol || game.winner)  return;

        const newBoard = [...(game.board?? Array(9).fill(null))];
        newBoard[index] = playerSymbol;
        const winner = calculateWinner(newBoard);
        try{
            client.models.Game.update({
                id: gameId,
                board: newBoard,
                currentTurn: playerSymbol === 'X' ? 'O' : 'X',
                winner: winner,
            });
        } catch (err){
            console.error('Error updating game:', err);
        }
    };
    return (
    <div>
        <h2>{game.playerX} vs {game.playerO}</h2>
       <div
        style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            maxWidth: '280px', // ensures board stays square
            margin: '1rem auto',
        }}
        >
  {(game.board ?? Array(9).fill(null)).map((value: string|null, index:number) => (
    <Square key={index} value={value} onClick={() => handleClick(index)} />
  ))}
</div>
    </div>
    );
};
function calculateWinner(board: (string | null)[]) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (const [a,b,c] of lines){ 
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            //setWinningLine([a,b,c]);
            return board[a];
        }
    }
    return null;
}