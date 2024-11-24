import React, { useEffect, useState } from 'react'

export default function LifeLinePopup(prop) {

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    // setIsPopupOpen(prop.isOpen)
  // Function to handle closing the popup

  useEffect(() => {
    if (prop.isOpen) {
      setIsPopupOpen(true); // Open the popup
      
      const timer = setTimeout(() => {
        setIsPopupOpen(false); // Close the popup
        prop.onClose(); // Call the onClose function after closing the popup
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [prop]);
  const handleClose = () => {
    setIsPopupOpen(false);
    prop.onClose();
  };

  // Return null if the popup is not open
  if (!isPopupOpen) {
    
    return null;
  }
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={handleClose}>Close</button>
        {prop.usedLifelines[2]?
        <>
        <h2>50/50</h2>
        <h5>Activating</h5>
        <p>Hidding 2 wrong options please wait....</p>
        </>:
        null
      
      }
        
        
      </div>
    </div>
  )
}
