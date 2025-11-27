import React, { useState, useEffect } from 'react';

const Typewriter = ({ text, delay = 50, infinite = false }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else if (infinite) {
      // Optional: Reset for infinite loop
    }
  }, [currentIndex, delay, text, infinite]);

  return <span>{currentText}</span>;
};

export default Typewriter;
