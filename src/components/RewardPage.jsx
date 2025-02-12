import React, { useEffect, useState } from "react";
import "./RewardPage.css";

export default function RewardPage({ earned }) {
  const [earnedCount, setEarnedCount] = useState("");

  useEffect(() => {
    setEarnedCount(earned);
  }, [earned]);

  return (
    <div className="container2">
      <div className="congratulations-text">Congratulations!</div>
      <div className="congratulations-text">You Won: {earnedCount}</div>
      <button className="submit-btn" onClick={() => window.location.reload()}>
        Play Again
      </button>
    </div>
  );
}
