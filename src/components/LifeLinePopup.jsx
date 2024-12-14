import React, { useEffect, useState } from 'react'
import useSound from "use-sound";
import AudiencePoll from './AudiencePoll';
import audiencePollSound from "../soundClips/audiencePoll.mp3";
import phoneAfriendSound from "../soundClips/phoneAFriend.mp3";
export default function LifeLinePopup(prop) {

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [options, setOptions] = useState(['A', 'B', 'C', 'D']);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [isPollOpen, setIsPollOpen] = useState(false);
  const [animationVotes, setAnimationVotes] = useState([]);
  const [playAudiencePoll, { stop: stopAudiencePoll }] = useSound(audiencePollSound, { volume: 0.7 });
  const [playPhoneAfriend, { stop: stopPhoneAfriend }] = useSound(phoneAfriendSound, { volume: 0.7 });
  // setIsPopupOpen(prop.isOpen)
  // Function to handle closing the popup

  useEffect(() => {
    console.log(prop.audiencePoll,prop.fiftyfifty,prop.phoneAFriend);
    if (prop.isOpen) {
      setCorrectIndex(prop.data[prop.questionNumber].answer.findIndex((ans) => ans.correct));
      console.log(prop.data[prop.questionNumber].answer[correctIndex]);
      setCorrectAnswer(prop.data?.[prop.questionNumber]?.answer?.[correctIndex]?.text || "No correct answer");
      setIsPopupOpen(true); // Open the popup
      handlePrepare();
      // const timer = setTimeout(() => {
      //   setIsPopupOpen(false); // Close the popup
      //   prop.onClose(); // Call the onClose function after closing the popup
      // }, 5000);

      // return () => clearTimeout(timer);
    }
  }, [prop]);

  const handlePrepare = () => {
    setIsPreparing(true);
    const prepareTimer = setTimeout(() => {
      setIsPreparing(false);
      handleShowAnimation();
    }, 5000);

    return () => clearTimeout(prepareTimer); // Cleanup
  };

  const handleShowAnimation = () => {
    setShowAnimation(true);
    const animationTimer = setTimeout(() => {
      setShowAnimation(false);
      setIsPopupOpen(false);
      prop.onClose();
    }, 10000);

    return () => clearTimeout(animationTimer); // Cleanup
  };

  const handleClose = () => {
    setIsPopupOpen(false);
    prop.onClose();
  };

  // Return null if the popup is not open
  if (!isPopupOpen) {
    return null;
  }

  // Determine the content based on the lifeline used
  const renderLifelineContent = () => {
    if (isPreparing) {
      if(prop.audiencePoll){
        playAudiencePoll();
      return (
        <>
          <h2>Ask the Audience</h2>
          <h5>Activating</h5>
          <p>Gathering audience opinions...</p>
        </>
      );
      }
      else if(prop.fiftyfifty){
        return(
        <>
          <h2>50/50</h2>
          <h5>Activating</h5>
        </>
        );
      }else if(prop.phoneAFriend){
        playPhoneAfriend();
        return(
        <>
          <h2>Phone a Friend</h2>
          <h5>Activating</h5>
          <p>Calling your friend for assistance...</p>
        </>
        );
      }
    }
    else if (prop.audiencePoll && showAnimation) {
      return (
        <AudiencePoll
          options={options}
          correctIndex={correctIndex}
          isOpen={true}
          onClose={() => console.log("Popup closed")}
        />
      );
    } else if (prop.phoneAFriend && showAnimation) {
      return (
        <>
          <h2>Phone a Friend</h2>
          <h5>Activated</h5>
          <p>According to your friend correct answer is</p>
          <br></br>
          <h3>{correctAnswer}</h3>
        </>
      );
    } else if (prop.fiftyfifty && showAnimation) {
      return (
        <>
          <h2>50/50</h2>
          <h5>Activating</h5>
          <p>Hiding two incorrect options, please wait...</p>
        </>
      );
    } else {
      return <p>No lifeline activated</p>;
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        {renderLifelineContent()}
      </div>
    </div>
  )
}
