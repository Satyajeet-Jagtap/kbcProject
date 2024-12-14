import React, { useEffect, useState } from "react";
import "./AudiencePoll.css";

export default function AudiencePoll({ options, correctIndex, isOpen, onClose }) {
  const [animationVotes, setAnimationVotes] = useState([]);
  const [isPollOpen, setIsPollOpen] = useState(false);
  const [mostVotedIndex, setMostVotedIndex] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setIsPollOpen(true);

      const totalVotes = 100;
      const generatedVotes = generateRandomVotes(options.length, totalVotes, correctIndex);
      setAnimationVotes(Array(options.length).fill(0));

      let step = 0;
      const interval = setInterval(() => {
        step += 5;
        const animated = generatedVotes.map((v) =>
          Math.min(v, (step * v) / 100)
        );
        setAnimationVotes(animated);

        if (step >= 100) {
          clearInterval(interval);

          // Determine the most answered option after animation
          const maxVotes = Math.max(...animated);
          const mostVotedOption = animated.findIndex(votePercentage => votePercentage === maxVotes);
          setMostVotedIndex(mostVotedOption);
        }
      }, 100);

      const closeTimer = setTimeout(() => {
        onClose();
      }, 10000);

      return () => {
        clearInterval(interval);
        clearTimeout(closeTimer);
      };
    }
  }, [isOpen, correctIndex, options, onClose]);

  const generateRandomVotes = (numOptions, totalVotes, correctIdx) => {
    const randomVotes = Array.from({ length: numOptions }, (_, i) =>
      i === correctIdx ? 0 : Math.floor(Math.random() * (totalVotes / 5)) // Other options get fewer votes
    );
  
    const sumOtherVotes = randomVotes.reduce((a, b) => a + b, 0);
    const remainingVotes = totalVotes - sumOtherVotes;
  
    // Assign remaining votes to the correct answer to ensure it's the highest
    randomVotes[correctIdx] += remainingVotes;
  
    return randomVotes.map((vote) =>
      Math.round((vote / totalVotes) * 100)
    );
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Audience Poll</h2>
        <p>The audience is voting...</p>

        <div className="poll-results">
          {options.map((option, index) => (
            <div
              key={index}
              className={`poll-result ${index === mostVotedIndex ? "green" : "grey"}`}
            >
              <span>{option}</span>
              <div className="bar-container">
                <div
                  className={`bar ${index === correctIndex ? "correct" : ""}`}
                  style={{ width: `${animationVotes[index] || 0}%` }}
                />
              </div>        
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
