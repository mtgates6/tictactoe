import React from 'react';

interface SquareProps {
  value: string | null;
  onClick: () => void;
}

export const Square: React.FC<SquareProps> = ({ value, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={!!value}
      style={{
        width: '80px',
        height: '80px',
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: value === 'X' ? '#1859adff' : '#9a18a5ff', // different color per player
        backgroundColor: '#978e8eff',
        border: '2px solid #444',
        borderRadius: '8px',
        cursor: value ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease-in-out',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {value}
    </button>
  );
};