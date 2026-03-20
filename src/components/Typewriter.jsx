import React, { useState, useEffect, useCallback } from 'react';

const Typewriter = ({ 
  texts = [], 
  text = '',
  delay = 60, 
  deleteDelay = 30,
  pauseTime = 2000 
}) => {
  const strings = texts.length > 0 ? texts : [text];
  const [currentStringIndex, setCurrentStringIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [phase, setPhase] = useState('typing'); // typing | pausing | deleting

  const currentString = strings[currentStringIndex];

  useEffect(() => {
    let timeout;
    
    if (phase === 'typing') {
      if (currentText.length < currentString.length) {
        timeout = setTimeout(() => {
          setCurrentText(currentString.slice(0, currentText.length + 1));
        }, delay);
      } else {
        // Done typing — pause before deleting
        if (strings.length > 1) {
          timeout = setTimeout(() => setPhase('pausing'), pauseTime);
        }
      }
    } else if (phase === 'pausing') {
      setPhase('deleting');
    } else if (phase === 'deleting') {
      if (currentText.length > 0) {
        timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, deleteDelay);
      } else {
        // Move to next string
        setCurrentStringIndex((prev) => (prev + 1) % strings.length);
        setPhase('typing');
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, phase, currentString, strings, delay, deleteDelay, pauseTime]);

  return (
    <span>
      {currentText}
      <span
        className="inline-block w-[2px] h-[1em] bg-cyan-400 ml-1 align-middle"
        style={{ animation: 'blink 1s step-end infinite' }}
      />
    </span>
  );
};

export default Typewriter;
