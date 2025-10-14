
import React, { useState } from 'react';
import Square  from './Square';
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use';

const Gameboard: React.FC = () => {
    const { width, height } = useWindowSize();
    const [board, setBoard] = useState<Array<'X' | 'O' | null>>(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
    const [winner, setWinner] = useState<'X' | 'O' | null>(null);
    const [winningLine, setWinningLine] = useState<number[] | null>(null);

    const handleSquareClick = (index: number) => {
        if (board[index] || winner) return; // ignore if filled or game over

        const newBoard = [...board];
        newBoard[index] = currentPlayer;
        setBoard(newBoard);
        const gameWinner = checkWinner(newBoard);
        if (gameWinner) {
            setWinner(gameWinner);
            console.log(`Winner is ${gameWinner}`);
            console.log(`Winning line is ${winningLine}`);
            return;
        }   
        // Switch turns
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    };


    const checkWinner = (board: Array<'X' | 'O' | null>): 'X' | 'O' | null => {
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
        for (let line of lines) {
            const [a, b, c] = line;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                setWinningLine(line);
                return board[a];
            }
        }
        return null;
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setCurrentPlayer('X');
        setWinner(null);
        setWinningLine(null);
    }
    return(
        <div className="gameboard">
            {winner && <Confetti width={width} height={height} />}
            {winner ? <div className="winner-text">Winner: {winner}</div> : <div className='turn-text'>Current Player: {currentPlayer}</div>}
        <div className="grid">
            {board.map((value, index) => (
                <Square
                key={index}
                value={value}
                onClick={() => handleSquareClick(index)}
                isWinningSquare={winningLine?.includes(index) || false}
                />
            ))}
        </div>
        <div className='reset'>
            <button onClick={resetGame}>Reset Game</button>
        </div>
    </div>
    );
};
export default Gameboard;