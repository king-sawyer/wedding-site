import { useState, useEffect, useRef } from "react";
import "./Wordle.css";

import { supabase } from "../SupabaseClient";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

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

  const [revealingRow, setRevealingRow] = useState(null);
  const [revealingCol, setRevealingCol] = useState(-1);

  const [invalidRow, setInvalidRow] = useState(null);

  const [winner, setWinner] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [loading, setLoading] = useState(false);

  const revealingRef = useRef(false);

  useEffect(() => {
    setSolution("KINGS");

    const fetchUserData = async () => {
      setLoading(true);
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
      } else {
        setGuesses([]);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [user.userId]);

  async function setCompletdWordle() {
    await supabase
      .from("users")
      .update({ completedWordle: true })
      .eq("uuid", user.userId);
  }

  useEffect(() => {
    if (!solution) return;
    let combined = {};
    for (const g of guesses) {
      combined = computeKeyStatuses(String(g).toUpperCase(), combined);
    }
    setKeyStatuses(combined);

    if (guesses.includes(solution)) {
      setWinner(true);
      setGameOver(true);
    } else if (guesses.length > 5 && !guesses.includes(solution)) {
      setGameOver(true);
    }
  }, [solution, guesses]);

  async function checkWord(word) {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    try {
      const response = await fetch(url);
      if (!response.ok) return false;
      const result = await response.json();
      return result && result.length > 0;
    } catch {
      return false;
    }
  }

  const computeKeyStatuses = (guess, prevStatuses = {}) => {
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

    return newStatuses;
  };

  const handleKeyPress = async (key) => {
    if (status) return;

    if (revealingRef.current) return;

    if (key === "ENTER" && currentGuess.length === WORD_LENGTH) {
      const isValid = await checkWord(currentGuess.toLowerCase());
      if (!isValid) {
        const currentRow = guesses.length;
        setInvalidRow(currentRow);
        setTimeout(() => setInvalidRow(null), 600);
        toast.error("Word not found in word list 😞", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }

      revealingRef.current = true;

      const newGuess = currentGuess.toUpperCase();
      setRevealingRow(guesses.length);
      setRevealingCol(0);

      let i = 0;
      const revealInterval = setInterval(() => {
        setRevealingCol(i);

        if (i === WORD_LENGTH - 1) {
          clearInterval(revealInterval);

          setTimeout(() => {
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

            setRevealingRow(null);
            setRevealingCol(-1);
            setCurrentGuess("");

            if (newGuess === solution) {
              setCompletdWordle();

              setWinner(true);
              setGameOver(true);
              setStatus("🎉 You Win!");
            } else if (guesses.length + 1 === MAX_ATTEMPTS) {
              setCompletdWordle();

              //Add word to show user lost

              setGuesses((prev) => {
                const updatedGuesses = [...prev, "BOZO"];

                supabase
                  .from("users")
                  .update({ wordleGuesses: updatedGuesses })
                  .eq("uuid", user.userId)
                  .then(({ error }) => {
                    if (error) console.error("Supabase update failed:", error);
                  });

                return updatedGuesses;
              });

              setStatus(`❌ Game Over! The word was ${solution}`);
              setGameOver(true);
            }

            revealingRef.current = false;
          }, 400);
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
      <h1 className="title">WORDLE</h1>

      {loading ? (
        <div style={{ margin: "auto" }}>
          <ClipLoader
            color={"#5a86ad"}
            loading={true}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <>
          <div className="board">
            {[...Array(MAX_ATTEMPTS)].map((_, rowIdx) => {
              const guess =
                guesses[rowIdx] ||
                (rowIdx === guesses.length ? currentGuess : "");
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

          {gameOver ? (
            <div className="backdrop">
              <div>
                {winner ? (
                  <div className="modal">
                    {" "}
                    {guesses.length == 1 ? (
                      <>
                        {" "}
                        <h2>✅ You did it! ✅</h2>{" "}
                        <p>Wow! On your first try!</p> <p>You are the best!</p>{" "}
                        <p>We love you ❤️</p>
                      </>
                    ) : (
                      <>
                        {" "}
                        <h2>✅ You did it! ✅</h2>{" "}
                        <p>It took you: {guesses.length} tries!</p>{" "}
                        <p>You are the best! 😍</p>{" "}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="modal">
                    <h2>❌ So CLOSE! ❌</h2>
                    <div
                      style={{
                        fontFamily:
                          "system-ui, Avenir, Helvetica, Arial, sans-serif",
                      }}
                    >
                      You (probably) almost had it with: <p>{guesses[5]}!</p>
                      <p>The word was: KINGS</p>
                    </div>{" "}
                    <p>We still love you ❤️‍🩹</p>{" "}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <></>
          )}

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
        </>
      )}
    </div>
  );
};

export default Wordle;
