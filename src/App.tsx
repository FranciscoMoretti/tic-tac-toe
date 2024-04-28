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

const BOARD_SIZE = 3;

export default function Game() {
  const [history, setHistory] = useState<SquareValue[][]>([
    Array(BOARD_SIZE * BOARD_SIZE).fill(""),
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const [movesAscending, setMovesAscending] = useState(true);

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
        <div>
          <p>History</p>{" "}
          <button onClick={() => setMovesAscending((curr) => !curr)}>
            Change sort order
          </button>
        </div>
        <ol
          style={{
            display: "flex",
            flexDirection: movesAscending ? "column" : "column-reverse",
          }}
        >
          {history.map((_, i) => (
            <li key={i}>
              {i === currentMove ? (
                <p>{`You are at move ${i}`}</p>
              ) : (
                <button onClick={() => setCurrentMove(i)}>{`Step ${i}`}</button>
              )}
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
      {new Array(BOARD_SIZE).fill("").map((_, i) => (
        <div className="board-row">
          {new Array(BOARD_SIZE).fill("").map((_, j) => (
            <Square
              onClick={() => handleClick(i * BOARD_SIZE + j)}
              value={squares[i * BOARD_SIZE + j]}
            ></Square>
          ))}
        </div>
      ))}
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
