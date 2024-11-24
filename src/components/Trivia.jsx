import { useEffect } from "react";
import { useState } from "react"
// import useSound from "./use-sound"


export default function Trivia({
    data,
    setStop,
    questionNumber,
    setQuestionNumber,
    isFiftyLifeline,
    setIsFiftyLifeline
}) {
    const [question, setQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [className, setclassName] = useState("answer");

    useEffect(() => {
        setQuestion(data[questionNumber - 1])
    }, [data, questionNumber])

    const delay = (duration, callback) => {
        setTimeout(() => {
            callback();
        }, duration)
    };

    useEffect(() => {
        console.log(data[questionNumber].answer.correct);
    }, [isFiftyLifeline])



    const handleClick = (a) => {
        setSelectedAnswer(a);
        setclassName("answer active");
        delay(3000, () => setclassName(a.correct ? "answer correct" : "answer wrong"))
        delay(6000, () => {
            if (a.correct) {
                setQuestionNumber((prev) => prev + 1);
                setSelectedAnswer(null);
                setIsFiftyLifeline(false);

            } else {
                setStop(true);
            }
        })
        // setTimeout(()=>{
        //     console.log("df")
        //     setclassName(a.correct ? "answer correct" : "answer wrong")
        // },3000)  

    }
    console.log(data, setStop, setQuestionNumber, questionNumber);
    // Function to render answer options
    const renderAnswers = () => {
        // Check if the 50-50 lifeline is active and the question exists
        // if (isFiftyLifeline && question) {
        //     // Filter out two wrong options
        //     const optionsToShow = question.answer.filter((a) => a.correct || Math.random() < 0.5);
        //     return optionsToShow.map((a) => (
        //         <div className={selectedAnswer === a ? className : "answer"} onClick={() => handleClick(a)}>
        //             {a.text}
        //         </div>
        //     ));
        // } else {
        if (question) {
            const optionsToShow = question.answer.filter((a) => a.correct)
            const randomIncorrectOption = question.answer
                .filter((a) => !a.correct)  // Filter out incorrect answers
                .sort(() => Math.random() - 0.5)  // Shuffle them randomly
                .slice(0, 2);
                
            // Render all answer options
            return question?.answer.map((a) => {
                const hideOption = isFiftyLifeline && randomIncorrectOption.some((option) => option.text === a.text);
                console.log( " dsds"+ hideOption);
                const hideOptionClass = hideOption ? "answer hidden" : "";
                console.log( " dsds"+ hideOptionClass);
                return (
                    <div
                    className={`${selectedAnswer === a ? className : "answer"} ${hideOptionClass}`}
                    onClick={() => handleClick(a)}
                >
                        {a.text}
                    </div>
                );

            });
        }
    };

    return (
        <div className="trivia">
            <div className="question">{question?.question}</div>
            <div className="answers">{renderAnswers()}</div>
        </div>
    );
}
