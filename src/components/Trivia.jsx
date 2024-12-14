import { useEffect, useState } from "react";
import useSound from "use-sound";
import wrongAnswer from "../soundClips/wrongAnswer.mp3";
// import openSound from "../soundClips/opening.mp3";
import correctAnswer from "../soundClips/CorrectAnswer.mp3";


export default function Trivia({
    data,
    handleSetStop,
    questionNumber,
    setQuestionNumber,
    isFiftyLifeline,
        setIsFiftyLifeline,
        setPause // Add setPause prop
}) {
    const [question, setQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [className, setClassName] = useState("answer");
    const [hiddenAnswers, setHiddenAnswers] = useState([]);
    const [playCorrect, { stop: stopplayCorrect }] = useSound(correctAnswer, { volume: 0.7 });
    const [playWrong, { stop: stopplayWrong }] = useSound(wrongAnswer, { volume: 0.7 });

    useEffect(() => {
        setQuestion(data[questionNumber - 1]);
        setHiddenAnswers([]); // Reset hidden answers when the question changes
    }, [data, questionNumber]);

    const delay = (duration, callback) => {
        setTimeout(() => {
            callback();
        }, duration);
    };

    useEffect(() => {
        if (isFiftyLifeline && question) {
            // Filter and shuffle incorrect answers, then take 2 to hide
            const randomIncorrectAnswers = question.answer
                .filter((a) => !a.correct)
                .sort(() => Math.random() - 0.5)
                .slice(0, 2);
            setHiddenAnswers(randomIncorrectAnswers.map((a) => a.text));
        } else {
            setHiddenAnswers([]);
        }
    }, [isFiftyLifeline, question]);

    const handleClick = (a) => {
        if (selectedAnswer) return;

        setPause(true);
        setSelectedAnswer(a);
        setClassName("answer active ");
        delay(100, () => {
            
            setClassName(a.correct ? "answer correct" : "answer wrong");

            if (a.correct) {
                playCorrect(); // Play correct sound if the answer is correct
            } else {
                playWrong(); // Play wrong sound if the answer is incorrect
            }
        });
        delay(11000, () => {
            if (a.correct) {
                setQuestionNumber((prev) => prev + 1);
                console.log("selected question ");
                setSelectedAnswer(null);
                setIsFiftyLifeline(false);
                setPause(false); // Reset the lifeline
            } else {
                setQuestionNumber((prev) => prev - 1);
                handleSetStop();
            }
        });
    };  

    const renderAnswers = () => {
        if (question) {
            return question.answer.map((a) => {
                const isHidden = hiddenAnswers.includes(a.text);
                return (
                    <div
                        key={a.text}
                        className={`${selectedAnswer === a ? className : "answer"} ${
                            isHidden ? "hidden" : ""
                        }`}
                        onClick={() => !isHidden && handleClick(a)} // Prevent clicking hidden answers
                    >
                        {isHidden ? "" : a.text}
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
