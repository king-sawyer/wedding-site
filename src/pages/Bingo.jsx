//import React, { useState, useEffect } from "react";
import "./bingo.css";

export default function Bingo() {
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

  const shuffled = bingoWords.sort(() => Math.random() - 0.5);

  console.log(shuffled);
  bingoWords.splice(12, 0, "Free Space");

  return (
    <div className="bingo">
      <div className="bingo-title">
        <p>k</p>
        <p>i</p>
        <p>n</p>
        <p>g</p>
        <p>o</p>
      </div>
      <div className="bingo-board">
        {bingoWords.map((word, index) => (
          <div className="word-box" key={index}>
            {" "}
            {word.toUpperCase()}{" "}
          </div>
        ))}
      </div>
    </div>
  );
}
