import { useEffect, useMemo, useState } from "react";
import "./app.css";
import Trivia from "./components/Trivia";
import Timer from "./components/Timer";
import LifeLinePopup from "./components/LifeLinePopup";
import WelcomePage from "./components/WelcomePage";
import data from './assets/data';
import lifelines from "./assets/lifelines";
import { FaColonSign } from "react-icons/fa6";

function App() {
  const [userName, setUserName] = useState(null); // User's name
  const [questionNumber, setQuestionNumber] = useState(1);
  const [stop, handleStopState] = useState(false);
  const [stopCount, setStopCount] = useState(false);
  const [earned, setEarned] = useState("₹ 0");
  const [lifelineHover, setLifelineHover] = useState(new Array(lifelines.length).fill(false));
  const [usedLifelines, setUsedLifeLines] = useState(new Array(lifelines.length).fill(false));
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isFiftyLifeline, setIsFiftyLifeline] = useState(false);
  const [isAudiencePoll, setIsAudiencePoll] = useState(false);
  const [isPhoneAFriend, setIsPhoneAFriend] = useState(false);
  const [pause, setPause] = useState(false);

  // Money Pyramid data
  const moneyPyramid = useMemo(() =>
    [
      { id: 1, amount: "₹ 1000" },
      { id: 2, amount: "₹ 2000" },
      { id: 3, amount: "₹ 3000" },
      { id: 4, amount: "₹ 5000" },
      { id: 5, amount: "₹ 10,000" },
      { id: 6, amount: "₹ 20,000" },
      { id: 7, amount: "₹ 40,000" },
      { id: 8, amount: "₹ 80,000" },
      { id: 9, amount: "₹ 1,60,000" },
      { id: 10, amount: "₹ 3,20,000" },
      { id: 11, amount: "₹ 6,40,000" },
      { id: 12, amount: "₹ 12,50,000" },
      { id: 13, amount: "₹ 25,00,000" },
      { id: 14, amount: "₹ 50,00,000" },
      { id: 15, amount: "₹ 1,00,00,000" },
    ].reverse(),
    []
  );

  // Update earned amount when question number changes
  useEffect(() => {
    setEarned(moneyPyramid.find((m) => m.id === questionNumber).amount);
    // if (questionNumber < 5) {
    //   // setEarned(moneyPyramid.find((m) => m.id === questionNumber).amount);
    //   setEarned("0");
    // }else if (questionNumber < 10){
    //   setEarned("10,000");
    // }else if(questionNumber < 15){
    //   setEarned("3,20,000");
    // }else{
    //   setEarned("1,00,00,000");
    // }
  }, [moneyPyramid, questionNumber]);

  // Manage timer when popup is open/closed
  useEffect(() => {
    setStopCount(!isPopupOpen);
  }, [isPopupOpen]);

  useEffect(() => {
    setIsAudiencePoll(false);
    setIsFiftyLifeline(false);
    setIsPhoneAFriend(false);
  }, [questionNumber]);

  const handleWelcomeSubmit = (name) => {
    setUserName(name); // Capture user's name from WelcomePage
  };

  useEffect(()=>{
    setStopCount(!isPopupOpen);
  },[isPopupOpen])
  function showPopup(id){
    setLifelineHover(true)
  }

  const lifeLineClicked =(index,item)=>{
    setIsPopupOpen(true);
    const usedLifelinesArray = [...usedLifelines];
    usedLifelinesArray[index] = true;
    setUsedLifeLines(usedLifelinesArray);
    setIsAudiencePoll(false);
    setIsFiftyLifeline(false);
    setIsPhoneAFriend(false);
    if(index === 0){
      setIsAudiencePoll(true);
    }else if(index === 1){
      setIsPhoneAFriend(true);
    }else if(index === 2){
      setIsFiftyLifeline(true);
    }
    console.log("in App "+isAudiencePoll,isPhoneAFriend,isFiftyLifeline);
  }

  const handleSetStop = () =>{
    handleStopState(true);
  }

  const handleLifeline = () => {
    setIsPopupOpen(false);
    // setStopCount(true);
  };

  if (!userName) {
    return <WelcomePage onSubmit={handleWelcomeSubmit} />;
  }

  return (
    <div className="app">
      <div className="main">
        <div className="header">Welcome, {userName}!</div>
        {stop ? (
          <h1 className="endText">You Won: {earned}</h1>
        ) : (
          <>
            <div className="top">
              <div className={questionNumber<=10 ? "timer" : "timer hide"}>
                <Timer 
                handleSetStop={handleSetStop} 
                stopCount={stopCount} 
                questionNumber={questionNumber} 
                pause={pause}
                />
              </div>
            </div>
            <div className="bottom">
              <Trivia
                data={data}
                handleSetStop={handleSetStop}
                isFiftyLifeline={isFiftyLifeline}
                setIsFiftyLifeline={setIsFiftyLifeline}
                setQuestionNumber={setQuestionNumber}
                questionNumber={questionNumber}
                setPause={setPause}
              />
            </div>
          </>
        )}
      </div>

      <div className="ml-container">
      <div className="lifeline">
  {lifelines.map((item, index) => (
    <div key={item.id}>
      {/* Tooltip or info for the lifeline */}
      <div className={lifelineHover[index] && !stop ? "lifeline-info" : "lifeline-info hide"}>
        {item.info}
      </div>
      
      {/* Lifeline button */}
      <div
        onClick={() => 
          {
            if(!usedLifelines[index] && !stop){
              lifeLineClicked(index, item)
            } 
          }

          } // Disable click for used lifelines
        onMouseEnter={() => {
          if (!usedLifelines[index]) { // Only show hover if lifeline is not used
            const updatedHover = [...lifelineHover];
            updatedHover[index] = true;
            setLifelineHover(updatedHover);
          }
        }}
        onMouseLeave={() => {
          const updatedHover = [...lifelineHover];
          updatedHover[index] = false;
          setLifelineHover(updatedHover);
        }}  
        className={`lifeline-item ${usedLifelines[index] || stop ? "disabled" : ""}`}
        style={{
          pointerEvents: usedLifelines[index] || stop ? "none" : "auto", // Disable pointer events for used or stopped lifelines
          opacity: usedLifelines[index] || stop ? 0.5 : 1, // Visual feedback for disabled lifelines
          cursor: usedLifelines[index] || stop ? "not-allowed" : "pointer", // Show 'not-allowed' cursor for disabled lifelines
        }}
      >
      
        {item.icon ? item.icon : item.text}
      </div>
    </div>
  ))}
</div>


        <div className="pyramid">
          <ul className="moneyList">
            {moneyPyramid.map((m) => (
              <li
                key={m.id}
                className={questionNumber === m.id ? "moneyListItems active" : "moneyListItems"}
              >
                <span className="moneyListItemsNumber">{m.id}</span>
                <span className="moneyListItemsAmount">{m.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* <LifeLinePopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        usedLifelines={usedLifelines}
      /> */}

       <LifeLinePopup
       data={data} 
       questionNumber={questionNumber-1}
       isOpen={isPopupOpen} 
       onClose={handleLifeline} 
       usedLifelines={usedLifelines}
       fiftyfifty={isFiftyLifeline}
       audiencePoll={isAudiencePoll}
       phoneAFriend={isPhoneAFriend}
       />
    </div>
  );
}

export default App;
