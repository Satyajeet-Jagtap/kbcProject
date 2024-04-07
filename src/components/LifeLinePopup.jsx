import React, { useEffect, useState } from 'react'

export default function LifeLinePopup(prop,onClose=true) {

    const [isPopupOpen, setIsPopupOpen] = useState(prop.isOpen);
    // setIsPopupOpen(prop.isOpen)
  // Function to handle closing the popup
  const handleClose = () => {
    setIsPopupOpen(false);
    onClose(); // Callback function to notify parent component
  };

  // Return null if the popup is not open
  if (!isPopupOpen.isOpen) {
    
    return null;
  }
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={handleClose}>Close</button>
        {/* Popup content here */}
        <h2>Popup Title</h2>
        <p>This is the content of the popup.</p>
      </div>
    </div>
  )
}
