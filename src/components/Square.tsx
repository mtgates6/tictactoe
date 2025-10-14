import React from "react";

type SquareProps = {
    value: 'X' | 'O' | null;
    onClick: () => void;
    isWinningSquare?: boolean;
};

const Square: React.FC<SquareProps> = ({ value, onClick, isWinningSquare}) => {
    return (
        <button onClick={onClick} className={`square ${isWinningSquare ? 'winning' : ''}`}>
            {value}
        </button>
    );
};

export default Square;