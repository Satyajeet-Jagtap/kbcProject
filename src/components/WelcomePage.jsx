import React, { useState, useRef } from "react";
import useSound from "use-sound";
import "./WelcomePage.css";

import introSound from "../soundClips/introMusic.mp3"; // Your sound file path
import welcomeVideo from "../assets/videoTrimmed.mp4"; // Your video file path

export default function WelcomePage({ onSubmit, apiCallingDetails, fetchQuestionsDone }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState();
  const [category, setCategory] = useState(""); // Selected category
  const [subCategory, setSubCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showBeginButton, setShowBeginButton] = useState(false); // State for the "Let's Begin" button
  const videoRef = useRef(null); // Ref for the video element

  const [playIntro, { stop }] = useSound(introSound, { loop: true });
  const categories = {
    Technology: ["Artificial Intelligence", "Cybersecurity", "Gadgets", "Blockchain"],
    Politics: ["Elections", "Policies", "International Relations"],
    Programming: ["JavaScript", "Python", "Java", "C++", "Web Development"],
    Science: ["Biology", "Physics", "Chemistry", "Astronomy"],
    Mathematics: ["Algebra", "Geometry", "Calculus"],
    Sports: ["Football", "Basketball", "Tennis", "Cricket"],
    Entertainment: ["Movies", "TV Shows", "Music"],
    Business: ["Economics", "Finance", "Marketing", "Startup"],
    Health: ["Nutrition", "Mental Health", "Fitness"],
    Travel: ["Destinations", "Adventure", "Budget Travel"],
    Education: ["Online Learning", "Higher Education", "Skill Development"],
    Gaming: ["PC Games", "Console Games", "Mobile Games", "Esports"],
    Automobile: ["Electric Vehicles", "Sports Cars", "Motorcycles"],
    History: ["Ancient Civilizations", "World Wars", "Historical Figures"],
    Lifestyle: ["Fashion", "Home Decor", "Personal Development"],
    Food_Cooking: ["Recipes", "Culinary Tips", "World Cuisines"],
    Environment: ["Climate Change", "Sustainability", "Wildlife"],
    Space_Astronomy: ["Space Exploration", "Astrophysics", "Cosmology"],
    Philosophy: ["Ethics", "Metaphysics", "Political Philosophy"],
    Artificial_Intelligence: ["Machine Learning", "Deep Learning", "AI Ethics"]
  };

  const indianLanguages = [
    "Hindi",
    "Bengali",
    "Telugu",
    "Marathi",
    "Tamil",
    "Urdu",
    "Gujarati",
    "Malayalam",
    "Kannada",
    "Odia",
    "Punjabi",
    "Assamese",
    "Maithili",
    "Santali",
    "Kashmiri",
    "Konkani",
    "Sindhi",
    "Dogri",
    "Manipuri",
    "Bodo"
  ];

  const handleGetStarted = () => {
    setShowPopup(true);
    playIntro(); // Start playing the sound when the popup is shown
  };

  const handleSubmit = () => {
    if (name.trim()) {
      stop(); // Stop playing the sound once the name is submitted
      setShowPopup(false);
      //call an api after start 
      apiCallingDetails(category, subCategory,language);
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
    onSubmit(name, age, category, subCategory); // Transition to the next screen
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSubCategory(""); // Reset subcategory when category changes
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
            <p>Please fill below details to get started</p>
            <input
              required
              type="text"
              className="welcome-input"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Category Dropdown */}
            <select
              required
              className="welcome-input"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="" disabled hidden>Choose a Language</option>
              {indianLanguages.map((lang, index) => (
                <option key={index} value={lang}>{lang}</option>
              ))}
            </select>

            <select
              required
              className="welcome-input"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="" disabled hidden>Choose a Category</option>
              {Object.keys(categories).map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Subcategory Dropdown (Only shows when a category is selected) */}
            {category && (
              <select
                className="welcome-input"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
              >
                <option value="" disabled hidden height="50px">Choose a Subcategory</option>
                {categories[category].map((subCat, index) => (
                  <option key={index} value={subCat}>{subCat}</option>
                ))}
              </select>
            )}



            <button className="welcome-button" onClick={handleSubmit}>
              Start
            </button>
          </div>
        </div>
      )}

      {showVideo && (
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
      )}

      {showBeginButton && (
        <div className="begin-container">
          <button
            className="begin-button"
            onClick={handleBegin}
            disabled={!fetchQuestionsDone} // Disable button while loading
          >
            {!fetchQuestionsDone ? (
              <>
                <span className="loader"></span>
                <br></br>
                <br></br>
                Preparing Questions...
              </>
            ) : (
              "Let's Begin"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
