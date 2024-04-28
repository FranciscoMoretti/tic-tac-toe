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
  const [moveHistory, setMoveHistory] = useState<number[]>([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [movesAscending, setMovesAscending] = useState(true);

  const squares = history[currentMove];
  const winnerLine = calculateWinner(squares);
  const winner = winnerLine ? squares[winnerLine[0]] : "";
  const currentPlayer = currentMove % 2 ? "O" : "X";

  return (
    <div className="game">
      <div className="game-board">
        <Board
          currPlayer={currentPlayer}
          squares={squares}
          winnerLine={winnerLine}
          onPlay={(nextSquares: SquareValue[], clickIdx: number) => {
            const currHistory = history.slice(0, currentMove + 1);
            setHistory([...currHistory, nextSquares]);
            setMoveHistory([...moveHistory.slice(0, currentMove), clickIdx]);
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
                <button onClick={() => setCurrentMove(i)}>{`Step ${i} move ${
                  moveHistory[i] != undefined
                    ? Math.floor(moveHistory[i] / BOARD_SIZE) +
                      "," +
                      (moveHistory[i] % BOARD_SIZE)
                    : "-"
                }`}</button>
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
  winnerLine,
  onPlay,
}: {
  currPlayer: "X" | "O";
  squares: SquareValue[];
  winnerLine: number[] | null;
  onPlay: (nextSquares: SquareValue[], clickIdx: number) => void;
}) {
  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = currPlayer;
    onPlay(nextSquares, i);
  }

  return (
    <div>
      {new Array(BOARD_SIZE).fill("").map((_, i) => (
        <div className="board-row">
          {new Array(BOARD_SIZE).fill("").map((_, j) => (
            <Square
              className={
                winnerLine && winnerLine.includes(i * BOARD_SIZE + j)
                  ? "winner-cell"
                  : ""
              }
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
  className = "",
}: {
  value: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className: string;
}) {
  return (
    <button className={"square " + className} onClick={onClick}>
      {value}
    </button>
  );
}

function calculateWinner(squares: SquareValue[]): number[] | null {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const first = squares[line[0]];
    const winner =
      line.filter((idx) => squares[idx] == first).length === line.length;
    if (winner && first) {
      return [...line];
    }
  }
  return null;
}
