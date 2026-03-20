import React, { useState, useEffect, useCallback } from 'react';

const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';

const GlitchText = ({ text, as = 'span', className = '', interval = 4000 }) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [displayText, setDisplayText] = useState(text);

  const triggerGlitch = useCallback(() => {
    setIsGlitching(true);
    
    // Scramble characters rapidly
    let iterations = 0;
    const maxIterations = 6;
    const scrambleInterval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, idx) => {
            if (char === ' ') return ' ';
            if (iterations > maxIterations - 2 || Math.random() > 0.4) return text[idx];
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join('')
      );
      
      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(scrambleInterval);
        setDisplayText(text);
        setTimeout(() => setIsGlitching(false), 100);
      }
    }, 50);
  }, [text]);

  useEffect(() => {
    // Auto-glitch periodically
    const timer = setInterval(triggerGlitch, interval);
    // First glitch after initial delay
    const initialTimer = setTimeout(triggerGlitch, 1000);
    return () => {
      clearInterval(timer);
      clearTimeout(initialTimer);
    };
  }, [triggerGlitch, interval]);

  const Component = as;

  return (
    <Component
      className={`glitch-wrapper ${isGlitching ? 'glitch-active' : ''} ${className}`}
      onMouseEnter={triggerGlitch}
      style={{ cursor: 'default' }}
    >
      <span className="glitch-text relative z-10">{displayText}</span>
      <span className="glitch-copy glitch-top" aria-hidden="true">{displayText}</span>
      <span className="glitch-copy glitch-bottom" aria-hidden="true">{displayText}</span>
    </Component>
  );
};

export default GlitchText;
