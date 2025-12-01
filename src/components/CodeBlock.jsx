import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';

const CodeBlock = ({ code, language = 'text' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-5 bg-[#1e1e1e] rounded-lg border border-slate-700 shadow-sm group">
      {/* Obsidian-style Metadata Overlay */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-start px-3 py-1.5 z-10 select-none pointer-events-none">
        {/* Language Label (Top Left) */}
        <span className="text-[10px] font-sans text-slate-500 uppercase tracking-wider font-bold pt-1">
          {language !== 'text' ? language : ''}
        </span>
      </div>

      {/* Copy Button (Top Right) - Pointer events enabled */}
      <button 
        className="absolute top-1 right-1 px-2 py-1 text-[10px] font-sans text-slate-500 hover:text-slate-200 bg-transparent hover:bg-slate-700/50 rounded transition-colors z-20 flex items-center gap-1 cursor-pointer"
        onClick={handleCopy}
        title="Copy code"
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
        <span>{copied ? 'Copied' : 'Copy'}</span>
      </button>

      {/* Code Content */}
      <div className="font-mono rounded-lg overflow-hidden">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1.75rem 1rem 1rem 1rem', // Top padding accounts for the overlay labels
            background: 'transparent',
            fontSize: '14px',
            lineHeight: '1.5',
          }}
          wrapLongLines={true}
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;