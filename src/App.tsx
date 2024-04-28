import React, { useState } from "react";

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

type SquareValue = "X" | "O" | "";

export default function Game() {
  const [history, setHistory] = useState<SquareValue[][]>([Array(9).fill("")]);
  const [currentMove, setCurrentMove] = useState(0);

  const squares = history[currentMove];
  const winner = calculateWinner(squares);
  const currentPlayer = currentMove % 2 ? "O" : "X";

  return (
    <div className="game">
      <div className="game-board">
        <Board
          currPlayer={currentPlayer}
          squares={squares}
          onPlay={(nextSquares: SquareValue[]) => {
            const currHistory = history.slice(0, currentMove + 1);
            setHistory([...currHistory, nextSquares]);
            setCurrentMove((move) => move + 1);
          }}
        />
        {winner ? (
          <p>{`Winner: ${winner}`}</p>
        ) : (
          <p>{`Next player: ${currentPlayer}`}</p>
        )}
      </div>
      <div className="game-info">
        <p>History</p>
        <ol>
          {history.map((_, i) => (
            <li key={i}>
              <button onClick={() => setCurrentMove(i)}>{`Step ${i}`}</button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function Board({
  currPlayer,
  squares,
  onPlay,
}: {
  currPlayer: "X" | "O";
  squares: SquareValue[];
  onPlay: (nextSquares: SquareValue[]) => void;
}) {
  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = currPlayer;
    onPlay(nextSquares);
  }

  return (
    <div>
      <div className="board-row">
        <Square onClick={() => handleClick(0)} value={squares[0]}></Square>
        <Square onClick={() => handleClick(1)} value={squares[1]}></Square>
        <Square onClick={() => handleClick(2)} value={squares[2]}></Square>
      </div>
      <div className="board-row">
        <Square onClick={() => handleClick(3)} value={squares[3]}></Square>
        <Square onClick={() => handleClick(4)} value={squares[4]}></Square>
        <Square onClick={() => handleClick(5)} value={squares[5]}></Square>
      </div>
      <div className="board-row">
        <Square onClick={() => handleClick(6)} value={squares[6]}></Square>
        <Square onClick={() => handleClick(7)} value={squares[7]}></Square>
        <Square onClick={() => handleClick(8)} value={squares[8]}></Square>
      </div>
    </div>
  );
}

export function Square({
  value,
  onClick,
}: {
  value: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button onClick={onClick} className="square">
      {value}
    </button>
  );
}

function calculateWinner(squares: SquareValue[]) {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const first = squares[line[0]];
    const winner =
      line.filter((idx) => squares[idx] == first).length === line.length;
    if (winner && first) {
      return first;
    }
  }
  return null;
}
