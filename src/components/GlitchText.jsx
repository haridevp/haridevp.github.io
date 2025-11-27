import React from 'react';

const GlitchText = ({ text, as = 'span', className = '' }) => {
  const Component = as;
  return (
    <Component className={`relative inline-block group ${className}`}> 
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-red-500 opacity-0 group-hover:opacity-70 group-hover:translate-x-[2px] transition-all duration-75 select-none">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-blue-500 opacity-0 group-hover:opacity-70 group-hover:-translate-x-[2px] transition-all duration-75 select-none">{text}</span>
    </Component>
  );
};

export default GlitchText;
