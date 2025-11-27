import React, { useState } from 'react';
import { Minimize2, Maximize2, X } from 'lucide-react';

const WindowFrame = ({ title, children, onClose, active, scrollable = true }) => {
  const [isMaximized, setIsMaximized] = useState(false);

  const handleMinimize = () => {
    if (isMaximized) {
      setIsMaximized(false);
    } else {
      onClose();
    }
  };

  return (
    <div className={`flex flex-col border border-slate-700 bg-slate-900/90 backdrop-blur-sm overflow-hidden transition-all duration-300 ${
      isMaximized 
        ? 'fixed inset-0 z-[60] rounded-none m-0 w-screen h-screen' 
        : `h-full rounded-lg ${active ? 'ring-1 ring-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'opacity-50 blur-[1px] scale-[0.98]'}`
    }`}>
      {/* Window Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-800/80 border-b border-slate-700 select-none" onDoubleClick={() => setIsMaximized(!isMaximized)}>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-cyan-400 opacity-80 pl-2">{title}</span>
        </div>
        <div className="flex space-x-2 text-slate-400">
          <Minimize2 size={12} className="cursor-pointer hover:text-cyan-400" onClick={handleMinimize} />
          <Maximize2 size={12} className="cursor-pointer hover:text-cyan-400" onClick={() => setIsMaximized(!isMaximized)} />
          <X size={12} className="cursor-pointer hover:text-red-400" onClick={onClose} />
        </div>
      </div>
      {/* Window Content */}
      <div className={`flex-1 relative ${scrollable ? 'overflow-auto custom-scrollbar p-6 pb-32 md:pb-6' : 'overflow-hidden flex flex-col min-h-0'}`}>
        {scrollable && <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>}
        {children}
      </div>
    </div>
  );
};

export default WindowFrame;
