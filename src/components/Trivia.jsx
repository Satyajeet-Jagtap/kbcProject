import { useEffect, useState } from "react";
// import useSound from "./use-sound"


export default function Trivia({
    data,
    setStop,
    questionNumber,
    setQuestionNumber,
    isFiftyLifeline,
    setIsFiftyLifeline
}) {
    const [question,setQuestion]=useState(null);
    const[selectedAnswer,setSelectedAnswer]=useState(null);
    const[className,setclassName]=useState("answer");
    console.log("Trivia called");
    useEffect(()=>{
        setQuestion(data[questionNumber-1])
    },[data,questionNumber])

    const delay = (duration , callback)=>{
        setTimeout(()=>{
            callback();
        },duration)
    };

    useEffect(()=>{
        console.log(data[questionNumber].answer.correct);
    },[isFiftyLifeline])
    

    
    const handleClick=(a)=>{
        setSelectedAnswer(a);
        setclassName("answer active");
        delay(3000,()=>setclassName(a.correct ? "answer correct" : "answer wrong"))
        delay(6000,()=>{
            if(a.correct){
                setQuestionNumber((prev)=>prev+1);
                setSelectedAnswer(null);
                setIsFiftyLifeline(false);

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
  // Function to render answer options
  const renderAnswers = () => {
    // Check if the 50-50 lifeline is active and the question exists
    console.log("isfifty lifeline called "+ isFiftyLifeline+ " "+ question);
    if (isFiftyLifeline && question) {
       
        const correctOption = question.answer.find((a) => a.correct);
const incorrectOptions = question.answer.filter((a) => !a.correct);

// Randomly pick one incorrect option
const randomIncorrectOption =
  incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];

// Combine the correct answer with one random incorrect answer
const optionsToShow = [correctOption, randomIncorrectOption].filter(Boolean);
        console.log("optionsToShow "+ optionsToShow);
        return optionsToShow.map((a) => (
            <div className={selectedAnswer === a ? className : "answer"} onClick={() => handleClick(a)}>
                {a.text}
            </div> 
        )); 
    } else {
        // Render all answer options
        return question?.answer.map((a) => (
            <div className={selectedAnswer === a ? className : "answer"} onClick={() => handleClick(a)}>
                {a.text}
            </div>
        ));
    }
};

return (
    <div className="trivia">
        <div className="question">{question?.question}</div>
        <div className="answers">{renderAnswers()}</div>
    </div>
);
}
