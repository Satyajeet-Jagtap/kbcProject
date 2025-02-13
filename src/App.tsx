import { useEffect, useMemo, useState } from "react";
import "./app.css";
import LifeLinePopup from "./components/LifeLinePopup";
import Timer from "./components/Timer";
import Trivia from "./components/Trivia";
import WelcomePage from "./components/WelcomePage";
// import data from './assets/data';
import lifelines from "./assets/lifelines";
import RewardPage from "./components/RewardPage";
import Constants from "./constants/Constants.tsx";
import AiApi from "./api/AiApi.tsx";

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
  const [data, setData] = useState([]);
  const [fetchQuestionsDone, setFetchQuestionsDone] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [hasStopDuetoTime, setHasStopDueToTime] = useState(false);
  const [subCategory, setSubCategory] = useState("");



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

  const fetchQuestions = async (prompt) => {
    // console.log("📜 Checking Local Storage...");
    // const storedData = localStorage.getItem("data");

    // if (storedData) {
    //   console.log("📦 Using Cached Data from Local Storage" + JSON.parse(storedData));
    //   setData(JSON.parse(storedData));
    //   setFetchQuestionsDone(true);
    //   return; // Exit function to avoid API call
    // }

    // console.log("🌐 Fetching New Data from API...");

    function decrypt(encryptedText) {
      return atob(encryptedText);
    }

    const model = decrypt(Constants.model)

    const requestData = {
      model: model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    };

    try {
      const response = await AiApi(requestData);

      // Extract content and ensure valid JSON parsing
      const content = response?.choices?.[0]?.message?.content || "[]"; // Default to an empty array
      let parsedContent;

      try {
        parsedContent = JSON.parse(content);
      } catch (error) {
        console.error("❌ JSON Parse Error:", error);
        parsedContent = []; // Set fallback empty array
      }

      // console.log("dat is " + JSON.stringify(parsedContent));
      // Save in local storage & update state
      // localStorage.setItem("data", JSON.stringify(parsedContent));
      setData(parsedContent);
      setFetchQuestionsDone(true);

      // console.log("✅ Fetched & Stored Data:", parsedContent);

    } catch (error) {
      console.error("❌ Fetch Error:", error);
    }
  };



  useEffect(() => {

    if (hasStopDuetoTime) {
      // console.log("hasStopDuetoTime triggered. Current question number:", questionNumber);
      
      setQuestionNumber((prev) => {
        // console.log("Decreasing question number from", prev, "to", prev - 1);
        return prev - 1;
      });
    }
  }, [hasStopDuetoTime]); // ✅ Correct dependency
  
  // ✅ Use another useEffect to log the updated questionNumber AFTER it changes
  useEffect(() => {
    // console.log("Updated question number:", questionNumber);
  }, [questionNumber]);
  const handleSetStop = () => {
    // console.log("handleSetStop "+questionNumber);
    setHasStopDueToTime(true);
    handleStopState(true);
  }
  const handleSetStopAfterWrongAnswer = () => {
    handleStopState(true);
  }


  // Update earned amount when question number changes
  useEffect(() => {
    
    if (questionNumber > 15) {
      handleStopState(true);
      setEarned(moneyPyramid.find((m) => m.id === questionNumber - 1).amount);

    }else if (questionNumber ==0){
      setEarned("0");
    } else {
      setEarned(moneyPyramid.find((m) => m.id === questionNumber).amount);
    }
  }, [moneyPyramid, questionNumber,stop]);

  // Manage timer when popup is open/closed
  useEffect(() => {
    setStopCount(!isPopupOpen);
  }, [isPopupOpen]);

  useEffect(() => {
    setIsAudiencePoll(false);
    setIsFiftyLifeline(false);
    setIsPhoneAFriend(false);
  }, [questionNumber]);

  const handleWelcomeSubmit = (name, age, category, subCategory) => {
    generatePrompt(category, subCategory);
    setUserName(name);
  };

  const handleWelcomeDetails = (category, subCategory) => {
    generatePrompt(category, subCategory);
  };

  // ✅ This ensures `prompt` updates before fetching questions
  useEffect(() => {
    if (prompt) {
      // console.log("🛠 Fetching questions with prompt:", prompt);
      fetchQuestions(prompt);
    }
  }, [prompt]); // Runs when `prompt` changes

  const generatePrompt = (category, subCategory) => {
    let str = `Generate 15 multiple-choice questions in JSON format. 
      First 5 are easy, next 5 are medium, and last 5 are difficult. 
      consider sample [{"id":1,"question":"sample question","answer":[{"text":"sample option1","correct":true},{"text":"sample option2","correct":false},{"text":"sample option3","correct":false},{"text":"sample option4","correct":false}]}]
      Each question should have an id, a question field, and an answer array with four options,
      each having a text field and a correct field (true/false), and the correct answer should be in a random order.
      keys are id,question,answer,text,correct strictly.
      Category = ${category} 
      ${subCategory ? `Subcategory = ${subCategory}` : ""} 
      Only return JSON as an array without any extra text.
      Do not include category or subCategory keys in JSON.`.trim();

    setPrompt(str);
  };

  useEffect(() => {
    setStopCount(!isPopupOpen);
  }, [isPopupOpen])
  function showPopup(id) {
    setLifelineHover(true)
  }

  const lifeLineClicked = (index, item) => {
    setIsPopupOpen(true);
    const usedLifelinesArray = [...usedLifelines];
    usedLifelinesArray[index] = true;
    setUsedLifeLines(usedLifelinesArray);
    setIsAudiencePoll(false);
    setIsFiftyLifeline(false);
    setIsPhoneAFriend(false);
    if (index === 0) {
      setIsAudiencePoll(true);
    } else if (index === 1) {
      setIsPhoneAFriend(true);
    } else if (index === 2) {
      setIsFiftyLifeline(true);
    }
    // console.log("in App " + isAudiencePoll, isPhoneAFriend, isFiftyLifeline);
  }


  const handleLifeline = () => {
    setIsPopupOpen(false);
    // setStopCount(true);
  };

  if (!userName) {
    return <WelcomePage onSubmit={handleWelcomeSubmit} apiCallingDetails={handleWelcomeDetails} fetchQuestionsDone={fetchQuestionsDone} />;
  }

  return (
    <div className="app">
      <div className="main">
        <div className="header">Welcome, {userName}!</div>
        {stop ? (
          // <h1 className="endText">You Won: {earned}</h1>
          <RewardPage
            earned={earned}
          />
        ) : (
          <>
            <div className="top">
              <div className={questionNumber <= 10 ? "timer" : "timer hide"}>
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
                handleSetStopAfterWrongAnswer={handleSetStopAfterWrongAnswer}
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
                onClick={() => {
                  if (!usedLifelines[index] && !stop) {
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
        questionNumber={questionNumber - 1}
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
