import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { client } from '@amplifyClient';

interface GameSummary {
  id: string;
  playerX: string | null;
  playerO: string | null;
}

export const Lobby: React.FC = () => {
  const [games, setGames] = useState<GameSummary[]>([]);
  const navigate = useNavigate();

  // Fetch open games from backend
  const fetchGames = async () => {
    const result = await client.models.Game.list({
      filter: { winner: { eq: undefined } } // only active games
    });
    setGames(
      (result.data ?? [])
        .filter((g: any) => g.id !== null)
        .map((g: any) => ({
          id: g.id as string,
          playerX: g.playerX,
          playerO: g.playerO
        }))
    );
  };

  useEffect(() => {
    fetchGames();
  }, []);

  // Create a new game
  const createGame = async () => {
    const result = await client.models.Game.create({
      playerX: 'Player X',
      playerO: null,
      board: Array(9).fill(null),
      currentTurn: 'X',
      winner: null
    });
    const newGameId = result.data?.id;
    if (newGameId) navigate(`/game/${newGameId}`);
  };

  // Join an existing game
  const joinGame = async (gameId: string) => {
    const gameResult = await client.models.Game.get({ id: gameId });
    if (gameResult.data?.playerX && !gameResult.data?.playerO) {
      await client.models.Game.update({ id: gameId, playerO: 'Player O' });
    }
    navigate(`/game/${gameId}`);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Lobby</h1>
      <button onClick={createGame}>Create New Game</button>

      <h2>Available Games</h2>
      <ul>
        {games.map(game => (
          <li key={game.id}>
            {game.playerX} vs {game.playerO ?? 'Waiting for Player O'}
            {game.playerO === null && (
              <button onClick={() => joinGame(game.id)}>Join Game</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
