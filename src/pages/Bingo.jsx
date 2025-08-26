import React, { useState, useEffect } from "react";
import "./bingo.css";

import { supabase } from "../SupabaseClient";

export default function Bingo({ userData }) {
  const user = userData;

  const bingoWords = [
    "Use the photo booth",
    "Give someone a kiss",
    "See someone cry",
    "Request a song",
    "Get a tattoo",
    "Try both signature cocktails",
    "Tell a secret",
    "Give Sawyer a hug",
    "Give Shelby a hug",
    "Play a drinking game",
    "Do the connections",
    "Do the wordle",
    "Upload a picture",
    "Send us a message",
    "Do the worm",
    "Twerk",
    "Take a selfie with your table",
    "Leave us a voicemail",
    "Sign the guest book",
    "Make yourself a treat bag",
    "Say hi to the brides parents",
    "Say hi to the grooms parents",
    "Cheers someone not at your table",
    "Scratch off your lottery ticket",
  ];

  const fetchUserBingo = async (userId) => {
    const { data, error } = await supabase
      .from("users")
      .select("bingo_order, bingo_selected, bingoInit")
      .eq("uuid", userId)
      .single();

    if (error) {
      console.error("Error fetching bingo:", error);
      return null;
    }
    return data;
  };

  const [shuffled, setShuffled] = useState(Array(25).fill(""));
  const [selected, setSelected] = useState(Array(25).fill(false));

  useEffect(() => {
    const initBingo = async () => {
      const data = await fetchUserBingo(user.userId);

      if (data.bingoInit) {
        console.log(data);
        setShuffled(data.bingo_order);
        setSelected(data.bingo_selected);
      } else {
        const copy = [...bingoWords].sort(() => Math.random() - 0.5);
        copy.splice(12, 0, "Free Space");

        setShuffled(copy);
        const initialSelected = Array(25).fill(false);
        initialSelected[12] = true;
        setSelected(initialSelected);

        await supabase
          .from("users")
          .update({
            bingo_order: copy,
            bingo_selected: initialSelected,
            bingoInit: true,
          })
          .eq("uuid", user.userId);
      }
    };

    initBingo();
  }, []);

  const toggleSquare = async (index) => {
    const newSelected = [...selected];
    newSelected[index] = !newSelected[index];
    setSelected(newSelected);

    const { error } = await supabase
      .from("users")
      .update({ bingo_selected: newSelected })
      .eq("uuid", user.userId);

    if (error) console.error("Error updating bingo:", error);
  };

  useEffect(() => {
    const checkBingo = () => {
      const size = 5;
      // rows
      for (let r = 0; r < size; r++) {
        if ([...Array(size).keys()].every((c) => selected[r * size + c])) {
          return true;
        }
      }
      // cols
      for (let c = 0; c < size; c++) {
        if ([...Array(size).keys()].every((r) => selected[r * size + c])) {
          return true;
        }
      }
      // diagonals
      if ([...Array(size).keys()].every((i) => selected[i * size + i])) {
        return true;
      }
      if (
        [...Array(size).keys()].every(
          (i) => selected[i * size + (size - 1 - i)]
        )
      ) {
        return true;
      }
      return false;
    };

    if (checkBingo()) {
      console.log("BINGO");
    }
  }, [selected]);

  return (
    <div className="bingo">
      <div className="bingo-title">
        <p>K</p>
        <p>I</p>
        <p>N</p>
        <p>G</p>
        <p>O</p>
      </div>

      <div className="bingo-board">
        {shuffled.map((word, index) => (
          <div
            className={`word-box ${selected[index] ? "selected" : ""}`}
            key={index}
            onClick={() => toggleSquare(index)}
          >
            {word ? word.toUpperCase() : ""}
          </div>
        ))}
      </div>

      {/* {winner && <div className="bingo-winner">🎉 BINGO! 🎉</div>} */}
    </div>
  );
}
