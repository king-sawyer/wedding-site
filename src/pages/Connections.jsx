import { useState } from "react";
import { useEffect } from "react";

import data from "../connectionsdata.json";

import "./connections.css";
import { supabase } from "../SupabaseClient";
import { ClipLoader } from "react-spinners";

const Connections = ({ userData }) => {
  const user = userData;

  const [boxes, setBoxes] = useState(data);
  const [selectedWords, setSelectedWords] = useState([]);
  const [attempts, setAttempts] = useState(4);
  const [guesses, setGuesses] = useState([]);
  const [alreadyGuessed, setAlreadyGuessed] = useState(false);
  const [oneAway, setOneAway] = useState(false);

  const [numCorrect, setNumCorrect] = useState(0);

  const [loading, setLoading] = useState(true);
  const [hasRevealed, setHasRevealed] = useState(false);

  const [shake, setShake] = useState(false);

  const [playing, setPlaying] = useState(true);

  const [correctlyGuessedCategories, setCorrectlyGuessedCategories] = useState(
    []
  );

  useEffect(() => {
    async function fetchCompletedCategories() {
      const { data: completed, error } = await supabase
        .from("completed_categories")
        .select("*")
        .eq("user_uuid", user.userId);

      if (error) {
        console.error(error);
        return;
      }

      setCorrectlyGuessedCategories(
        completed.map((c) => ({
          category: c.category_name,
          words: c.words,
          color: c.color,
        }))
      );

      setBoxes((prev) => ({
        data: prev.data.filter(
          (box) => !completed.some((c) => c.words.includes(box.word))
        ),
      }));

      setLoading(false);
      setNumCorrect(completed.length);
    }

    async function fetchUserData() {
      const { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("uuid", user.userId);

      if (error) {
        console.error(error);
        return;
      }

      setAttempts(userData[0].connectionsAttempts);
    }

    fetchCompletedCategories();
    fetchUserData();
  }, []);

  useEffect(() => {
    checkWinCondition();

    async function updateSupabaseAttempts() {
      await supabase
        .from("users")
        .update({ connectionsAttempts: attempts })
        .eq("uuid", user.userId);
    }
    if (!loading) updateSupabaseAttempts();
  }, [attempts]);

  useEffect(() => {
    if (correctlyGuessedCategories.length == 4) {
      setPlaying(false);
    }
  }, [correctlyGuessedCategories]);

  const rearrange = () => {
    const shuffled = [...boxes.data].sort(() => Math.random() - 0.5);
    setBoxes({ data: shuffled });
  };

  const checkWinCondition = () => {
    if (numCorrect === 4) {
      console.log("You win!");
    }

    if (attempts === 0 && numCorrect < 4 && !hasRevealed) {
      console.log("You lose!");
      setHasRevealed(true);
      revealRemainingCategories();
    }
  };

  async function checkAttempt() {
    let categories = [];
    let counts = {};
    let categoryColor = "";

    boxes["data"].map((box) => {
      if (selectedWords.includes(box.word)) {
        categories.push(box.category);
        categoryColor = box.color;
      }
    });

    if (selectedWords.length < 4) {
      return;
    } else if (guesses.includes(selectedWords)) {
      console.log("Already guessed! :(");
      setAlreadyGuessed(true);
      setTimeout(() => setAlreadyGuessed(false), 2000);
      return;
    }

    categories.forEach(function (x) {
      counts[x] = (counts[x] || 0) + 1;
    });

    if (Object.values(counts).length == 1) {
      const guessedCategory = Object.keys(counts)[0];

      console.log("Yay!");

      setBoxes((prevBoxes) => ({
        data: prevBoxes.data.filter((box) => !selectedWords.includes(box.word)),
      }));

      setCorrectlyGuessedCategories((prev) => [
        ...prev,
        {
          category: guessedCategory,
          words: selectedWords,
          color: categoryColor,
        },
      ]);

      await supabase.from("completed_categories").insert({
        user_uuid: user.userId,
        category_name: guessedCategory,
        words: selectedWords,
        color: categoryColor,
      });

      setSelectedWords([]);
      setNumCorrect((numCorrect) => ++numCorrect);
    } else if (
      counts[Object.keys(counts)[0]] == 3 ||
      counts[Object.keys(counts)[1]] == 3
    ) {
      console.log("Ooh so close");

      setShake(true);
      setTimeout(() => setShake(false), 500);

      setOneAway(true);
      setTimeout(() => setOneAway(false), 2000);
      setAttempts((attempts) => attempts - 1);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setAttempts((attempts) => attempts - 1);
    }

    setGuesses((prev) => [...prev, selectedWords]);
  }

  const toggleBox = (word) => {
    setSelectedWords((prevSelected) => {
      const isSelected = prevSelected.includes(word);

      if (isSelected) {
        return prevSelected.filter((w) => w !== word);
      } else if (prevSelected.length < 4) {
        return [...prevSelected, word];
      } else {
        return prevSelected;
      }
    });
  };

  const clearSelected = () => {
    setSelectedWords([]);
  };

  async function revealRemainingCategories() {
    await new Promise((res) => setTimeout(res, 2000));

    clearSelected();
    let remainingBoxes = [...boxes.data];
    const revealed = [];

    while (remainingBoxes.length > 0) {
      const category = remainingBoxes[0].category;
      const color = remainingBoxes[0].color;
      const catWords = remainingBoxes
        .filter((b) => b.category === category)
        .map((b) => b.word);

      remainingBoxes = remainingBoxes.filter((b) => !catWords.includes(b.word));
      setBoxes({ data: remainingBoxes });

      revealed.push({ category, words: catWords, color });

      setCorrectlyGuessedCategories((prev) => [
        ...prev,
        { category, words: catWords, color },
      ]);

      await supabase.from("completed_categories").insert({
        user_uuid: user.userId,
        category_name: category,
        words: catWords,
        color: color,
      });

      await new Promise((res) => setTimeout(res, 1700));
    }
  }

  return (
    <>
      {loading ? (
        <ClipLoader
          color={"#5a86ad"}
          loading={true}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <div style={{ width: "95%", marginLeft: "auto", marginRight: "auto" }}>
          <h1
            style={{
              margin: "10px 0 0 0",
            }}
          >
            Connections
          </h1>
          <p>Create four groups of four!</p>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {correctlyGuessedCategories.map((guessedCategory, index) => (
              <div
                key={`correct-${index}`}
                className="correct-category-row"
                style={{ backgroundColor: guessedCategory.color }}
              >
                <div className="category-label">{guessedCategory.category}</div>
                <div className="category-words">
                  {guessedCategory.words.join(", ")}
                </div>
              </div>
            ))}

            {Array.from(
              { length: Math.ceil(boxes.data.length / 4) },
              (_, rowIndex) => (
                <div key={`row-${rowIndex}`} className="connections-row">
                  {boxes.data
                    .slice(rowIndex * 4, rowIndex * 4 + 4)
                    .map((box) => {
                      const isSelected = selectedWords.includes(box.word);
                      return (
                        <div
                          key={box.word}
                          onClick={() => toggleBox(box.word)}
                          className={`connections-word ${
                            isSelected ? "active" : ""
                          } ${
                            selectedWords.includes(box.word) && shake
                              ? "shake-animation"
                              : ""
                          }`}
                        >
                          {box.word}
                        </div>
                      );
                    })}
                </div>
              )
            )}
          </div>

          <div className="controls">
            {" "}
            {playing ? (
              <div>
                <div>
                  {" "}
                  <div
                    className={`fade-div ${alreadyGuessed ? "visible" : ""}`}
                  >
                    Already Guessed!
                  </div>
                  <div className={`fade-div ${oneAway ? "visible" : ""}`}>
                    One away...
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  <p>Mistakes Remaining:</p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      width: "80px",
                      marginLeft: "20px",
                    }}
                  >
                    {Array.from({ length: attempts })
                      .reverse()
                      .map((_, index) => (
                        <div
                          style={{
                            backgroundColor: "#8a9a5b",
                            borderRadius: "50%",
                            height: "15px",
                            width: "15px",
                            position: "relative",
                            marginRight: "10px",
                            flexShrink: 0,
                          }}
                          key={index}
                        ></div>
                      ))}
                  </div>
                </div>
                <button
                  onClick={rearrange}
                  style={{
                    padding: "8px 16px",
                    fontSize: "clamp(12px, 4vw, 16px)",
                    borderRadius: "100px",
                    backgroundColor: "#555",
                    color: "white",
                    border: "2px solid white",
                    margin: "10px",
                  }}
                >
                  Shuffle
                </button>
                <button
                  onClick={clearSelected}
                  style={{
                    padding: "8px 16px",
                    fontSize: "clamp(12px, 4vw, 16px)",
                    borderRadius: "100px",
                    backgroundColor: "#555",
                    color: selectedWords.length ? "white" : "gray",
                    border: selectedWords.length ? "2px solid white" : "none",
                    margin: "10px",
                  }}
                >
                  Deselect All
                </button>
                <button
                  onClick={checkAttempt}
                  style={{
                    padding: "8px 16px",
                    fontSize: "clamp(12px, 4vw, 16px)",
                    borderRadius: "100px",
                    backgroundColor: "#555",
                    color: selectedWords.length == 4 ? "white" : "gray",
                    border:
                      selectedWords.length == 4 ? "2px solid white" : "none",
                    margin: "10px",
                  }}
                >
                  Submit
                </button>{" "}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Connections;
