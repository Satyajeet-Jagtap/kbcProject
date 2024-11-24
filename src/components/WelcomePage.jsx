import React, { useState, useRef } from "react";
import useSound from "use-sound";
import "./WelcomePage.css";

import introSound from "../soundClips/introMusic.mp3"; // Your sound file path
import welcomeVideo from "../assets/videoTrimmed.mp4"; // Your video file path

export default function WelcomePage({ onSubmit }) {
  const [name, setName] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showBeginButton, setShowBeginButton] = useState(false); // State for the "Let's Begin" button
  const videoRef = useRef(null); // Ref for the video element

  const [playIntro, { stop }] = useSound(introSound, { loop: true });

  const handleGetStarted = () => {
    setShowPopup(true);
    playIntro(); // Start playing the sound when the popup is shown
  };

  const handleSubmit = () => {
    if (name.trim()) {
      stop(); // Stop playing the sound once the name is submitted
      setShowPopup(false);
      setShowVideo(true);
      setShowBeginButton(true); // Show the video after submitting the name

      if (videoRef.current) {
        videoRef.current.play(); // Play the video
      }
    }
  };

  const handleVideoEnd = () => {
    setShowBeginButton(true); // Show the "Let's Begin" button when the video ends
  };

  const handleBegin = () => {
    onSubmit(name); // Transition to the next screen
  };

  return (
    <div className="welcome-container">
      {!showPopup && !showVideo && !showBeginButton && (
        <div className="get-started-container">
          <button className="get-started-button" onClick={handleGetStarted}>
            Get Started with KBC
          </button>
        </div>
      )}

      {showPopup && !showVideo && !showBeginButton && (
        <div className="welcome-overlay">
          <div className="welcome-popup">
            <h1>Welcome to KBC!</h1>
            <p>Please enter your name to get started:</p>
            <input
              type="text"
              className="welcome-input"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button className="welcome-button" onClick={handleSubmit}>
              Start
            </button>
          </div>
        </div>
      )}

      {/* {showVideo && (
        <div className="video-container">
          <video
            ref={videoRef}
            className="welcome-video"
            src={welcomeVideo}
            onEnded={handleVideoEnd}
            autoPlay
            muted={false}
          />
        </div>
      )} */}

      {showBeginButton && (
        <div className="begin-container">
          <button className="begin-button" onClick={handleBegin}>
            Let's Begin
          </button>
        </div>
      )}
    </div>
  );
}
