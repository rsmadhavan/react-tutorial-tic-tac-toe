import { useState } from "react";

function Square({ value, onSquareClick, squareStyle }) {
  return (
    <button className={squareStyle} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares = [], onPlay, currentMove }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares;
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares, i);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner[0];
  } else if (currentMove === 9) {
    status = "Match Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  const LoopBoard = () => {
    let board = [];
    for (let i = 0; i < 3; i++) {
      let row = [];
      for (let j = 0; j < 3; j++) {
        let squareNumber = 3 * i + j;
        row.push(
          <Square
            key={squareNumber}
            value={squares[squareNumber]}
            onSquareClick={() => handleClick(squareNumber)}
            squareStyle={
              winner &&
              (squareNumber === winner[1].a ||
                squareNumber === winner[1].b ||
                squareNumber === winner[1].c)
                ? "square win"
                : "square"
            }
          />
        );
      }
      board.push(
        <div key={i} className="board-row">
          {row}
        </div>
      );
    }
    return board;
  };

  return (
    <>
      <div className="status">{status}</div>
      <LoopBoard />
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [toggleAsce, setToggleAsce] = useState(true);

  function handlePlay(nextSquares, i) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      {
        squares: nextSquares,
        latestMoveSquare: i
      }
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    const latestMoveSquare = squares.latestMoveSquare;
    const col = 1 + (latestMoveSquare % 3);
    const row = 1 + Math.floor(latestMoveSquare / 3);

    let description;
    if (move === currentMove && move) {
      return (
        <li key={move}>
          <b>You are at move #{move}</b>
        </li>
      );
    }
    if (move > 0) {
      description = `Go to move #${move} (${row},${col})`;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares && currentSquares.squares}
          onPlay={handlePlay}
          currentMove={currentMove}
        />
      </div>
      <div className="game-info">
        <button
          onClick={() => {
            setToggleAsce(!toggleAsce);
          }}
        >
          Toggle
        </button>
        <ol>{toggleAsce ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  if (!squares) {
    return null;
  }
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], { a, b, c }];
    }
  }
  return null;
}
