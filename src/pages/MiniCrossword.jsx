import React, { useState, useEffect } from "react";
import "./MiniCrossword.css";

const defaultPuzzle = {
  size: 5,
  grid: [
    ["C", "A", "T", null, "S"],
    ["A", null, "P", null, "E"],
    ["R", "A", "T", "E", "S"],
    [null, null, "N", null, "E"],
    ["D", "O", "G", null, "S"],
  ],
  clues: {
    across: {
      1: "Feline pet",
      3: "Plural of canine pet",
    },
    down: {
      1: "Opposite of up",
      2: "Rodent",
    },
  },
};

export default function MiniCrossword({ puzzle = defaultPuzzle }) {
  const [grid, setGrid] = useState([]);
  const [selected, setSelected] = useState({ row: 0, col: 0 });
  const [direction, setDirection] = useState("across");
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const initGrid = puzzle.grid.map((row, r) =>
      row.map((cell, c) => ({
        row: r,
        col: c,
        isBlock: cell === null,
        solution: cell || "",
        guess: "",
      }))
    );
    setGrid(initGrid);
    setStartTime(Date.now());
  }, [puzzle]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (startTime) setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const handleKeyDown = (e) => {
    if (!grid.length) return;
    const { row, col } = selected;
    if (/^[a-zA-Z]$/.test(e.key)) {
      const newGrid = [...grid];
      newGrid[row][col].guess = e.key.toUpperCase();
      setGrid(newGrid);
      moveNext();
    } else if (e.key === "Backspace") {
      const newGrid = [...grid];
      newGrid[row][col].guess = "";
      setGrid(newGrid);
      movePrev();
    } else if (e.key === "ArrowRight")
      setSelected({ row, col: Math.min(col + 1, puzzle.size - 1) });
    else if (e.key === "ArrowLeft")
      setSelected({ row, col: Math.max(col - 1, 0) });
    else if (e.key === "ArrowDown")
      setSelected({ row: Math.min(row + 1, puzzle.size - 1), col });
    else if (e.key === "ArrowUp")
      setSelected({ row: Math.max(row - 1, 0), col });
    else if (e.key === " ")
      setDirection(direction === "across" ? "down" : "across");
  };

  const moveNext = () => {
    let { row, col } = selected;
    if (direction === "across") col = Math.min(col + 1, puzzle.size - 1);
    else row = Math.min(row + 1, puzzle.size - 1);
    setSelected({ row, col });
  };

  const movePrev = () => {
    let { row, col } = selected;
    if (direction === "across") col = Math.max(col - 1, 0);
    else row = Math.max(row - 1, 0);
    setSelected({ row, col });
  };

  const checkAnswers = () => {
    const newGrid = grid.map((row) =>
      row.map((cell) => ({
        ...cell,
        wrong: cell.guess && cell.guess !== cell.solution,
      }))
    );
    setGrid(newGrid);
  };

  const revealAnswers = () => {
    const newGrid = grid.map((row) =>
      row.map((cell) => ({ ...cell, guess: cell.solution }))
    );
    setGrid(newGrid);
  };

  const resetPuzzle = () => {
    const newGrid = grid.map((row) =>
      row.map((cell) => ({ ...cell, guess: "", wrong: false }))
    );
    setGrid(newGrid);
    setStartTime(Date.now());
    setElapsed(0);
  };

  return (
    <div className="mini-crossword" tabIndex={0} onKeyDown={handleKeyDown}>
      <div className="grid-container">
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={`cell ${cell.isBlock ? "block" : ""} ${
                selected.row === r && selected.col === c ? "selected" : ""
              } ${cell.wrong ? "wrong" : ""}`}
              onClick={() => setSelected({ row: r, col: c })}
            >
              {cell.isBlock ? "" : cell.guess}
            </div>
          ))
        )}
      </div>
      <div className="sidebar">
        <h1>Mini Crossword</h1>
        <p>Time: {elapsed}s</p>
        <button onClick={checkAnswers}>Check</button>
        <button onClick={revealAnswers}>Reveal</button>
        <button onClick={resetPuzzle}>Reset</button>
        <h2>Clues</h2>
        <h3>Across</h3>
        <ul>
          {Object.entries(puzzle.clues.across).map(([num, clue]) => (
            <li key={`a-${num}`}>
              <strong>{num}.</strong> {clue}
            </li>
          ))}
        </ul>
        <h3>Down</h3>
        <ul>
          {Object.entries(puzzle.clues.down).map(([num, clue]) => (
            <li key={`d-${num}`}>
              <strong>{num}.</strong> {clue}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
