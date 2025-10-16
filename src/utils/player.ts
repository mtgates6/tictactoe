// src/utils/player.ts
export function getPlayerId(): string {
    const key = 'ttt:playerId';
    let id = localStorage.getItem(key);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(key, id);
    }
    return id;
  }
  export function setRole(gameId: string, role: 'X'|'O') {
    localStorage.setItem(`ttt:role:${gameId}`, role);
  }
  export function getRole(gameId: string): 'X'|'O'|null {
    return (localStorage.getItem(`ttt:role:${gameId}`) as any) ?? null;
  }