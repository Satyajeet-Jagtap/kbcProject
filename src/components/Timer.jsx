import { useEffect, useState } from "react";
import useSound from "use-sound";
import tickSound from "../soundClips/tikSound.mp3";
import openSound from "../soundClips/opening.mp3";
import tikSound1min from "../soundClips/1mintimer.mp3";

export default function Timer({ handleSetStop, stopCount, questionNumber, pause }) {
    const [timer, setTimer] = useState(30);

    // Use the useSound hook for sounds
    const [startSound, { stop: stopStartSound }] = useSound(openSound, { volume: 0.7 });
    const [playTick, { stop: stopTickSound }] = useSound(tickSound, { volume: 0.7 });
    const [play1MinTick, { stop: stop1MinTikSound }] = useSound(tikSound1min, { volume: 0.7 });
    console.log("Question no "+ questionNumber);
    useEffect(() => {
        // Play sounds when timer is reset
        if (timer === 30 && questionNumber <=5) {
            startSound(); // Play start sound
              playTick();    // Play ticking sound only if the timer is running
        }else if(timer === 60 && questionNumber <=10){
            startSound();
            play1MinTick();
        }
    }, [timer, stopCount, startSound, playTick]);

    useEffect(() => {
        if (timer === 0) {
            stopTickSound(); // Stop ticking sound when timer reaches 0
            handleSetStop(); // Trigger the stop logic
        }

        if (stopCount && !pause) {
            // playTick();
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(interval);
        } else {
            stopTickSound(); // Stop ticking sound when timer is paused
        }
    }, [timer, stopCount, stopTickSound,pause]);

    useEffect(() => {
        // Reset timer and stop sounds when question number changes
        if(questionNumber<=5){
            setTimer(30);
        }else if (questionNumber<=10){
            setTimer(60);
        }else if(questionNumber<=15){
            setTimer(60);
        }
        
        stopStartSound(); // Stop the start sound
        stopTickSound();  // Stop the ticking sound
    }, [questionNumber]);

    return timer;
}
