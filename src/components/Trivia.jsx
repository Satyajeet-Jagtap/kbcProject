import { useEffect } from "react";
import { useState } from "react"
// import useSound from "./use-sound"


export default function Trivia({
    data,
    setStop,
    questionNumber,
    setQuestionNumber
}) {
    const [question,setQuestion]=useState(null);
    const[selectedAnswer,setSelectedAnswer]=useState(null);
    const[className,setclassName]=useState("answer");

    useEffect(()=>{
        setQuestion(data[questionNumber-1])
    },[data,questionNumber])

    const delay = (duration , callback)=>{
        setTimeout(()=>{
            callback();
        },duration)
    };
    

    
    const handleClick=(a)=>{
        setSelectedAnswer(a);
        setclassName("answer active");
        delay(3000,()=>setclassName(a.correct ? "answer correct" : "answer wrong"))
        delay(6000,()=>{
            if(a.correct){
                setQuestionNumber((prev)=>prev+1);
                setSelectedAnswer(null);
            }else{
                setStop(true);
            }
        })
        // setTimeout(()=>{
        //     console.log("df")
        //     setclassName(a.correct ? "answer correct" : "answer wrong")
        // },3000)

    }
    console.log(data,setStop,setQuestionNumber,questionNumber);
  return (
    <div className="trivia">
        <div className="question">{question?.question}</div>

        <div className="answers">
            {question?.answer.map((a)=>(
                <div className={selectedAnswer === a ? className: "answer"} onClick={()=>handleClick(a)}>{a.text}</div>
            ))}
            
            
        </div>
        
    </div>
  )
}
