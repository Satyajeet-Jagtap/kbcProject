import { useEffect, useState } from "react"
import useSound from "use-sound";
import tickSound from "../soundClips/tikSound.mp3";
import openSound from "../soundClips/opening.mp3";

// import endSound from "./end.mp3";

export default function Timer({ setStop, stopCount, questionNumber }) {
    const [timer, setTimer] = useState(30);

     // Use the useSound hook for sounds
     const [startSound] = useSound(openSound, { volume: 0.5 });
     const [playTick] = useSound(tickSound, { volume: 0.9 });
    //  const [playEnd] = useSound(endSound, { volume: 0.7 });

    useEffect(() => {
        if (timer ==30) {
            console.log("if condition called...");
            startSound(); // Play start sound when the timer begins
            playTick();  // Play the 30-second ticking sound ONCE
        }
    }, [stopCount, timer, playTick,startSound]);

    useEffect(() => {
        if (timer === 0) {
            return setStop(true);
        }

        if (stopCount) {
            // startSound(); 
            // playTick(); 
           
            const interval = setInterval(() => {
                // setTimer((prev) => prev - 1);
                setTimer((prev) => {
                    if (prev > 0) {
                        // playTick(); // Play tick sound on every countdown
                    }
                    return prev - 1;
                });
            }, 4000);

            return () => clearInterval(interval);
        }   
    }, [setStop, timer, stopCount,playTick,startSound]);



    useEffect(() => {
        // Reset timer when question number changes
        setTimer(30);
    }, [questionNumber]);

    // Return timer value
    return timer;
}

