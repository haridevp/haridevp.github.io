import React from 'react';

const CodeBlock = ({ code, language = 'bash' }) => (
  <div className="my-4 rounded-md overflow-hidden border border-slate-700 bg-[#0d1117]">
    <div className="flex items-center justify-between px-3 py-1 bg-slate-800 border-b border-slate-700">
      <span className="text-xs text-slate-400 font-mono">{language}</span>
      <button 
        className="text-xs text-cyan-400 hover:text-cyan-300 font-mono"
        onClick={() => navigator.clipboard.writeText(code.trim())}
      >
        Copy
      </button>
    </div>
    <pre className="p-3 overflow-x-auto text-sm font-mono text-slate-300">
      <code>{code.trim()}</code>
    </pre>
  </div>
);

export default CodeBlock;
