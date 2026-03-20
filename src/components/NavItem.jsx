import React from 'react';

const NavItem = ({ id, label, icon: Icon, activeTab, setActiveTab, special = false }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-mono transition-all duration-300 border-l-2 relative group
      ${activeTab === id
        ? special
          ? 'border-purple-400 text-purple-300 bg-purple-950/30'
          : 'border-cyan-400 text-cyan-400 bg-cyan-950/30'
        : special
          ? 'border-transparent text-purple-400 hover:text-purple-300 hover:bg-purple-900/20'
          : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
      }`}
  >
    {/* Active glow dot */}
    {activeTab === id && (
      <span
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[1px] w-[3px] h-5 rounded-r-full ${
          special ? 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]' : 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]'
        }`}
        style={{ animation: 'pulseGlow 2s ease-in-out infinite' }}
      />
    )}
    <Icon size={18} className={`transition-transform duration-200 group-hover:scale-110 ${special && activeTab !== id ? 'animate-pulse' : ''}`} />
    <span>{label}</span>
    {/* Hover arrow indicator */}
    <span className={`ml-auto text-xs transition-all duration-200 ${
      activeTab === id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0'
    }`}>→</span>
  </button>
);

export default NavItem;
