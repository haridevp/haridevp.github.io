import React, { useState } from 'react';
import { Minus, X as XIcon, Maximize2 } from 'lucide-react';

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
    <div className={`flex flex-col border bg-slate-900/90 backdrop-blur-sm overflow-hidden transition-all duration-300 ${
      isMaximized 
        ? 'fixed inset-0 z-[60] rounded-none m-0 w-screen h-screen border-slate-700' 
        : `h-full rounded-lg ${active 
            ? 'border-slate-700 ring-1 ring-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.1)]' 
            : 'border-slate-800 opacity-50 blur-[1px] scale-[0.98]'}`
    }`}>
      {/* Window Header */}
      <div 
        className="flex items-center justify-between px-4 py-2.5 bg-slate-800/90 border-b border-slate-700/80 select-none backdrop-blur-sm" 
        onDoubleClick={() => setIsMaximized(!isMaximized)}
      >
        {/* Traffic light dots */}
        <div className="flex items-center space-x-2">
          <div className="traffic-dot dot-close" onClick={onClose} title="Close">
            <XIcon size={7} strokeWidth={3} />
          </div>
          <div className="traffic-dot dot-minimize" onClick={handleMinimize} title="Minimize">
            <Minus size={7} strokeWidth={3} />
          </div>
          <div className="traffic-dot dot-maximize" onClick={() => setIsMaximized(!isMaximized)} title="Maximize">
            <Maximize2 size={6} strokeWidth={3} />
          </div>
          <span className="text-xs font-mono text-slate-500 pl-3 tracking-wide">{title}</span>
        </div>

        {/* Right side decorative */}
        <div className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/30"></span>
          <span className="text-[10px] font-mono text-slate-600 tracking-wider">
            {active ? 'ACTIVE' : 'IDLE'}
          </span>
        </div>
      </div>

      {/* Window Content */}
      <div className={`flex-1 relative ${scrollable ? 'overflow-auto custom-scrollbar p-4 md:p-6 pb-32 md:pb-6' : 'overflow-hidden flex flex-col min-h-0'}`}>
        {scrollable && <div className="absolute inset-0 animated-grid-bg pointer-events-none"></div>}
        {children}
      </div>
    </div>
  );
};

export default WindowFrame;
