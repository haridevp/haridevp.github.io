import React from 'react';

const NavItem = ({ id, label, icon: Icon, activeTab, setActiveTab, special = false }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-mono transition-all duration-200 border-l-2
      ${activeTab === id 
        ? 'border-cyan-400 text-cyan-400 bg-cyan-950/30'
        : special 
          ? 'border-transparent text-purple-400 hover:text-purple-300 hover:bg-purple-900/20'
          : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800'
      }`}
  >
    <Icon size={18} className={special ? "animate-pulse" : ""} />
    <span>{label}</span>
  </button>
);

export default NavItem;
