
import { useEffect, useMemo, useState } from "react";
import "./app.css"
import Trivia from "./components/Trivia";
import Timer from "./components/Timer";

import data from './assets/data'
import lifelines from "./assets/lifelines";
import LifeLinePopup from "./components/LifeLinePopup";

function App() {
  const[questionNumber,setQuestionNumber]=useState(1);
  const[stop,setStop]=useState(false);
  const[earned,setEarned]=useState("$ 0");
  const[lifelineHover,setLifelineHover]=useState(new Array(lifelines.length).fill(false));
  const[usedLifelines,setUsedLifeLines]=useState(new Array(lifelines.length).fill(false));
  const[isPopupOpen,setIsPopupOpen]=useState(false);
 
  const moneyPyramid = useMemo(()=>
    [
      {id:1, amount:"$ 100"},
      {id:2, amount:"$ 200"},
      {id:3, amount:"$ 300"},
      {id:4, amount:"$ 500"},
      {id:5, amount:"$ 1000"},
      {id:6, amount:"$ 2000"},
      {id:7, amount:"$ 4000"},
      {id:8, amount:"$ 8000"},
      {id:9, amount:"$ 16000"},
      {id:10, amount:"$ 32000"},
      {id:11, amount:"$ 64000"},
      {id:12, amount:"$ 125000"},
      {id:13, amount:"$ 250000"},
      {id:14, amount:"$ 500000"},
      {id:15, amount:"$ 1000000"},
      
      
    ].reverse(),
  []);
    
  useEffect(()=>{
    questionNumber>1 && setEarned(moneyPyramid.find((m)=>m.id ===questionNumber-1).amount)
  },[moneyPyramid,questionNumber])

  function showPopup(id){
    setLifelineHover(true)
  }

  const handleLifeline = () => {

    setIsPopupOpen(true);
  };
  return (
    <>
    <div className="app">
      <div className="main">
        {stop ? <h1 className="endText">You earned:{earned}</h1>: (
          <>
        <div className="top">
          <div className="timer">
            <Timer setStop={setStop} questionNumber={questionNumber}/>
            
            </div>
        </div>
        <div className="bottom">
            <Trivia 
            data={data} 
            setStop={setStop} 
            setQuestionNumber={setQuestionNumber}
            questionNumber={questionNumber}/>
        </div>
        </>
        ) }
      </div>
      <div className="ml-container">
      <div className="lifeline">
      {lifelines.map((item, index) => (
        <div key={item.id}>
          <div className={`${lifelineHover[index] ? "lifeline-info" : "lifeline-info hide"}`}>{item.info}</div>
          <div
          onClick={() => setIsPopupOpen(true)}
            // onMouseEnter={() => {
            //   const updatedHover = [...lifelineHover];
            //   updatedHover[index] = true;
            //   setLifelineHover(updatedHover);
            // }}
            // onMouseLeave={() => {
            //   const updatedHover = [...lifelineHover];
            //   updatedHover[index] = false;
            //   setLifelineHover(updatedHover);
            // }}
            className="lifeline-item"
          >
            {item.icon ? item.icon : item.text}
          </div>
          {/* <div className={`${lifelineHover[index] ? "lifeline-desc" : "lifeline-desc hide"}`}>{item.description}</div> */}
        </div>
      ))}
        {/* <div className="lifeline-item"><IoIosPeople/></div>
        <div className="lifeline-item"><IoCallOutline /></div>
        <div className="lifeline-item">50/50</div> */}
      </div>
      <div className="pyramid">
      <ul className="moneyList">
        {moneyPyramid.map(m=>(
          <li className={questionNumber ===m.id ? "moneyListItems active" :"moneyListItems"}>
          <span className="moneyListItemsNumber">{m.id}</span>
          <span className="moneyListItemsAmount">{m.amount}</span>
        </li>
        ))}
        
      </ul>
      </div>
      
      </div>
      
      
      
    </div>
    <LifeLinePopup isOpen={isPopupOpen}/>
    </>

  );
}

export default App;
