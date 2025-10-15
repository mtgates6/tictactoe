
import React, { useEffect, useState } from 'react';
import Square  from './Square';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import API  from 'aws-amplify';
import { createGame, updateGame} from '../graphql/mutations';
import { onUpdateGame } from '../graphql/subscriptions';

const Gameboard: React.FC = () => {
    const { width, height } = useWindowSize();
    const [gameId, setGameId] = useState<string | null>(null);
    const [board, setBoard] = useState<Array<'X' | 'O' | null>>(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
    const [winner, setWinner] = useState<'X' | 'O' | null>(null);
    const [winningLine, setWinningLine] = useState<number[] | null>(null);
    const [player, setPlayer] = useState<'X' | 'O' | null>(null); // Track if this client is player X or O

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


    const checkWinner = (b: Array<'X' | 'O' | null>): 'X' | 'O' | null => {
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
            const [a, bIndex, c] = line;
            if (b[a] && b[a] === b[bIndex] && b[a] === b[c]) {
                setWinningLine(line);
                return b[a];
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

    const handleCreateGame = async () => {
        try {
            const result: any = await API.graphql({
                query: createGame,
                variables: {
                    input: {
                        playerX: 'player1',
                        board: Array(9).fill(null),
                        currentTurn: 'X'
                    }
                }
            });
            const newGame = result.data.createGame;
            setGameId(newGame.id);
            setPlayer("X");
            console.log('Game created:', result.data.createGame);
        } catch (error) {
            console.error('Error creating game:', error);
        }
    };
    const handleJoinGame = async (id: string) => {
        try {
            await Amplify.API.graphql({
                query: updateGame,
                variables: {
                    input: {
                        id,
                        playerO: 'player2'
                    }  
                }
            });
            setGameId(id);
            setPlayer("O");
            console.log('Joined game:', id);
        } catch (error) {
            console.error('Error joining game:', error);
        }
    };
    const handleMove = async (index: number) => {
        if (!gameId || board[index] || winner) return; 
        if (player !== currentPlayer) return; // Not this player's turn
        const newBoard = [...board];
        newBoard[index] = currentPlayer;
        const win = checkWinner(newBoard);
        if (win) {
            setWinner(win);
        }
        try {
            await Amplify.API.graphql({
                query: updateGame,
                variables: {
                    input: {
                        id: gameId,
                        board: newBoard,
                        currentTurn: currentPlayer === 'X' ? 'O' : 'X',
                        winner: win
                    }
                }
        });
        } catch (error) {
            console.error('Error making move:', error);
        }   
    };

    useEffect(() => {
        if (!gameId) {return;}
        const observable = Amplify.API.graphql(
            graphqlOperation(onUpdateGame, { filter: { id: { eq: gameId } } })
        ) as any; // Cast to Observable<any>
        const subscription = observable.subscribe({
            next: (eventData: any) => {
                const updatedGame = eventData.value.data.onUpdateGame;
                setBoard(updatedGame.board);
                setCurrentPlayer(updatedGame.currentTurn);
                setWinner(updatedGame.winner);  
            }
        });
        return () => {
            subscription.unsubscribe();
        };
    }, [gameId]);

    return(
        <div className="game-container">
        {!gameId ? (
            <>
                <button onClick={handleCreateGame}> Create Game</button>
                <br></br>
                <input type="text" placeholder="Enter Game ID to join" id="joinId" />
                <br></br>
                <button onClick={() => handleJoinGame((document.getElementById('joinId') as HTMLInputElement).value)}>Join Game</button>
            </>
        ) : (
            <>
            <div className="gameboard">
                {winner && <Confetti width={width} height={height} />}
                {winner ? <div className="winner-text">`Player ${winner} wins!`</div> : <div className='turn-text'>`Player ${currentPlayer}'s turn`</div>}
            <div className="grid">
                {board.map((value, index) => (
                    <Square
                    key={index}
                    value={value}
                    onClick={() => handleMove(index)}
                    isWinningSquare={winningLine?.includes(index) || false}
                    />
                ))}
            </div>
            <div className='reset'>
                <button onClick={resetGame}>Reset Game</button>
            </div>
        </div>s
        </>
        )}
    </div>
    );
};
export default Gameboard;