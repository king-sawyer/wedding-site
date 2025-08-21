import { useState, useEffect } from "react";
import "./Wordle.css";

import { supabase } from "../SupabaseClient";

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const KEYBOARD_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

const Wordle = ({ userData }) => {
  const user = userData;
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [status, setStatus] = useState("");
  const [keyStatuses, setKeyStatuses] = useState({});

  // const [isChecking, setIsChecking] = useState(false); // show spinner
  const [revealingRow, setRevealingRow] = useState(null);
  const [revealingCol, setRevealingCol] = useState(-1);

  const [invalidRow, setInvalidRow] = useState(null);

  useEffect(() => {
    setSolution("KINGS");

    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("wordleGuesses")
        .eq("uuid", user.userId)
        .maybeSingle();

      if (error) {
        console.error(error);
        return;
      }

      if (data && data.wordleGuesses) {
        let savedGuesses = data.wordleGuesses;

        if (typeof savedGuesses === "string") {
          try {
            savedGuesses = JSON.parse(savedGuesses);
          } catch (err) {
            console.error("Failed to parse wordleGuesses:", err);
            savedGuesses = [];
          }
        }

        setGuesses(savedGuesses);

        let combinedStatuses = {};
        savedGuesses.forEach((guess) => {
          updateKeyStatuses(guess, combinedStatuses);
        });
      } else {
        setGuesses([]);
      }
    };

    fetchUserData();
  }, []);

  async function checkWord(word) {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    try {
      const response = await fetch(url);
      if (!response.ok) return false;
      const result = await response.json();
      return result && result.length > 0;
    } catch (error) {
      return false;
    }
  }

  const updateKeyStatuses = (guess, prevStatuses = {}) => {
    const newStatuses = { ...prevStatuses };

    guess.split("").forEach((letter, i) => {
      if (solution[i] === letter) {
        newStatuses[letter] = "correct";
      } else if (solution.includes(letter)) {
        if (newStatuses[letter] !== "correct") {
          newStatuses[letter] = "present";
        }
      } else {
        if (!newStatuses[letter]) {
          newStatuses[letter] = "absent";
        }
      }
    });

    setKeyStatuses(newStatuses);
  };

  const handleKeyPress = async (key) => {
    if (status) return;

    if (key === "ENTER" && currentGuess.length === WORD_LENGTH) {
      const isValid = await checkWord(currentGuess);
      if (!isValid) {
        const currentRow = guesses.length;
        setInvalidRow(currentRow);
        setTimeout(() => setInvalidRow(null), 600);
        return;
      }

      const newGuess = currentGuess.toUpperCase();
      setRevealingRow(guesses.length);
      setRevealingCol(0);

      let i = 0;
      const revealInterval = setInterval(() => {
        setRevealingCol(i);

        if (i === WORD_LENGTH - 1) {
          // last letter
          clearInterval(revealInterval);

          // Add guess after last flip
          setGuesses((prev) => {
            const updatedGuesses = [...prev, newGuess];

            supabase
              .from("users")
              .update({ wordleGuesses: updatedGuesses })
              .eq("uuid", user.userId)
              .then(({ error }) => {
                if (error) console.error("Supabase update failed:", error);
              });

            return updatedGuesses;
          });

          updateKeyStatuses(newGuess);
          setRevealingRow(null);
          setRevealingCol(-1);
          setCurrentGuess("");

          if (newGuess === solution) {
            setStatus("🎉 You Win!");
          } else if (guesses.length + 1 === MAX_ATTEMPTS) {
            setStatus(`❌ Game Over! The word was ${solution}`);
          }
        }

        i++;
      }, 400);
    } else if (key === "DEL") {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(currentGuess + key);
    }
  };

  useEffect(() => {
    const listener = (e) => {
      if (e.key === "Enter") handleKeyPress("ENTER");
      else if (e.key === "Backspace") handleKeyPress("DEL");
      else if (/^[a-zA-Z]$/.test(e.key)) handleKeyPress(e.key.toUpperCase());
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  });

  const getTileClass = (letter, index, rowComplete, rowIndex, isSavedGuess) => {
    let base = "tile";

    if (rowIndex === invalidRow) return base + " shake";

    if (rowIndex === revealingRow) {
      if (index > revealingCol) return base;
      if (solution[index] === letter) return base + " flip correct";
      if (solution.includes(letter)) return base + " flip present";
      return base + " flip absent";
    }

    if (rowComplete || isSavedGuess) {
      if (solution[index] === letter) return base + " correct";
      if (solution.includes(letter)) return base + " present";
      return base + " absent";
    }

    return base;
  };

  return (
    <div className="wordle-container">
      <h1 className="title">Wordle Clone</h1>

      <div className="board">
        {[...Array(MAX_ATTEMPTS)].map((_, rowIdx) => {
          const guess =
            guesses[rowIdx] || (rowIdx === guesses.length ? currentGuess : "");
          const rowComplete = rowIdx < guesses.length;
          const isSavedGuess = rowIdx < guesses.length;
          return (
            <div key={rowIdx} className="row">
              {[...Array(WORD_LENGTH)].map((_, colIdx) => {
                const letter = guess[colIdx] || "";
                return (
                  <div
                    key={colIdx}
                    className={getTileClass(
                      letter,
                      colIdx,
                      rowComplete,
                      rowIdx,
                      isSavedGuess
                    )}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {status && <p className="status">{status}</p>}

      <div className="keyboard">
        {KEYBOARD_ROWS.map((row, i) => (
          <div key={i} className="keyboard-row">
            {i === 2 && (
              <button
                className="key wide"
                onClick={() => handleKeyPress("ENTER")}
              >
                Enter
              </button>
            )}
            {row.split("").map((letter) => (
              <button
                key={letter}
                className={`key ${keyStatuses[letter] || ""}`}
                onClick={() => handleKeyPress(letter)}
              >
                {letter}
              </button>
            ))}
            {i === 2 && (
              <button
                className="key wide"
                onClick={() => handleKeyPress("DEL")}
              >
                ⌫
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wordle;
