import React, { useEffect, useState } from 'react';
import './TypingText.css'; // Import your CSS file for styling

const TypingText = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    let charIndex = 0;
    const intervalId = setInterval(() => {
      if (charIndex <= text.length) {
        setDisplayText(text.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, 100); // Adjust typing speed here (milliseconds per character)

    // Toggle cursor visibility every 500ms
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);

    // Clean up intervals on component unmount
    return () => {
      clearInterval(intervalId);
      clearInterval(cursorInterval);
    };
  }, [text]);

  return (
    <div className="typing-text-container">
      <h1 className="typing-text">{displayText}</h1>
      {/* {cursorVisible && <span className="typing-cursor">|</span>} */}
    </div>
  );
};

export default TypingText;