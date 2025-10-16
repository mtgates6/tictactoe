import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { client } from '../amplifyClient';

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
    console.log('[Lobby] list:start');
    try {
      const result = await client.models.Game.list({
        filter: { winner: { eq: undefined } }
      });
      console.log('[Lobby] list:success', { count: (result.data ?? []).length });
      setGames(
        (result.data ?? [])
          .filter((g: any) => g.id !== null)
          .map((g: any) => ({
            id: g.id as string,
            playerX: g.playerX,
            playerO: g.playerO
          }))
      );
    } catch (error) {
      console.error('[Lobby] list:error', error);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  // Create a new game
  const createGame = async () => {
    console.log('[Lobby] create:start');
    try {
      const result = await client.models.Game.create({
        playerX: 'Player X',
        playerO: null,
        board: Array(9).fill(null),
        currentTurn: 'X',
        winner: null
      });
      const newGameId = result.data?.id;
      console.log('[Lobby] create:success', { id: newGameId });
      if (newGameId) navigate(`/game/${newGameId}`);
    } catch (error) {
      console.error('[Lobby] create:error', error);
    }
  };

  // Join an existing game
  const joinGame = async (gameId: string) => {
    console.log('[Lobby] join:start', { gameId });
    try {
      const gameResult = await client.models.Game.get({ id: gameId });
      const game = gameResult.data;
      console.log('[Lobby] join:loaded', { hasX: !!game?.playerX, hasO: !!game?.playerO });
      if (game?.playerX && !game?.playerO) {
        await client.models.Game.update({ id: gameId, playerO: 'Player O' });
        console.log('[Lobby] join:updated O');
      }
      navigate(`/game/${gameId}`);
    } catch (error) {
      console.error('[Lobby] join:error', error);
    }
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
