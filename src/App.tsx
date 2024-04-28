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
  const currentsSquaresIdx = history.length - 1;

  const squares = history[currentsSquaresIdx];
  const currentPlayer = squares.filter(Boolean).length % 2 ? "O" : "X";
  const winner = calculateWinner(squares);

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={squares}
          onPlay={(idx) => {
            if (squares[idx] || winner) {
              return;
            }
            const newHistory = history.map((el) => el.slice());
            const newSquares = history[currentsSquaresIdx].slice();
            newSquares[idx] = currentPlayer;
            newHistory.push(newSquares);
            setHistory(newHistory);
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
            <li>
              <button
                onClick={() => setHistory(history.slice(0, i + 1))}
              >{`Step ${i}`}</button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function Board({
  squares,
  onPlay,
}: {
  squares: SquareValue[];
  onPlay: (squareIdx: number) => void;
}) {
  return (
    <div>
      <div className="board-row">
        <Square onClick={() => onPlay(0)} value={squares[0]}></Square>
        <Square onClick={() => onPlay(1)} value={squares[1]}></Square>
        <Square onClick={() => onPlay(2)} value={squares[2]}></Square>
      </div>
      <div className="board-row">
        <Square onClick={() => onPlay(3)} value={squares[3]}></Square>
        <Square onClick={() => onPlay(4)} value={squares[4]}></Square>
        <Square onClick={() => onPlay(5)} value={squares[5]}></Square>
      </div>
      <div className="board-row">
        <Square onClick={() => onPlay(6)} value={squares[6]}></Square>
        <Square onClick={() => onPlay(7)} value={squares[7]}></Square>
        <Square onClick={() => onPlay(8)} value={squares[8]}></Square>
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
