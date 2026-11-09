import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Terminal, ArrowRight, Download, Mail, BookOpen,
  Github, Linkedin, Shield, FileText, Check, Copy, X, Key, ExternalLink
} from 'lucide-react';
import { USER_CONFIG } from '../data/config';

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  const dialogRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2200);
  };

  const COMMAND_ITEMS = [
    {
      category: 'Interactive Labs',
      items: [
        {
          id: 'c2-dissector',
          title: 'Stealth-C2 Protocol Dissector',
          sub: 'Explore Discord HTTPS steganography & AES-GCM framing',
          icon: Shield,
          action: () => {
            const el = document.getElementById('c2-lab');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            onClose();
          }
        },
        {
          id: 'ad-lab',
          title: 'Active Directory Attack Lab',
          sub: 'Inspect the 4-machine virtual enterprise kill chain',
          icon: Terminal,
          action: () => {
            const el = document.getElementById('ad-lab');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            onClose();
          }
        }
      ]
    },
    {
      category: 'Navigation',
      items: [
        {
          id: 'nav-exp',
          title: 'Research & Experience',
          sub: 'ASTRA Lab (CyStar), IIT Madras & Red Team advisory',
          icon: Terminal,
          action: () => {
            const el = document.getElementById('experience');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            onClose();
          }
        },
        {
          id: 'nav-projects',
          title: 'Selected Projects',
          sub: 'C2 frameworks, distributed systems, & offensive tools',
          icon: Shield,
          action: () => {
            const el = document.getElementById('projects');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            onClose();
          }
        },
        {
          id: 'nav-writeups',
          title: 'CTF Writeups & Security Notes',
          sub: '24 Advent of Cyber walkthroughs & AD notes',
          icon: BookOpen,
          action: () => {
            const el = document.getElementById('writeups');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            onClose();
          }
        },
        {
          id: 'nav-research',
          title: 'Publications & Talks',
          sub: 'Springer LNNS Scopus paper & DeepTrustxAI workshop',
          icon: FileText,
          action: () => {
            const el = document.getElementById('research');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            onClose();
          }
        }
      ]
    },
    {
      category: 'Actions & Credentials',
      items: [
        {
          id: 'act-copy-email',
          title: 'Copy Email Address',
          sub: USER_CONFIG.email,
          icon: Mail,
          action: () => {
            navigator.clipboard.writeText(USER_CONFIG.email);
            showToast('Email copied to clipboard!');
          }
        },
        {
          id: 'act-copy-pgp',
          title: 'Copy PGP Fingerprint',
          sub: USER_CONFIG.pgpKey,
          icon: Key,
          action: () => {
            navigator.clipboard.writeText(USER_CONFIG.pgpKey);
            showToast('PGP fingerprint copied!');
          }
        },
        {
          id: 'act-download-resume',
          title: 'Download Resume (PDF)',
          sub: 'Single Page Offensive Security Resume',
          icon: Download,
          action: () => {
            const a = document.createElement('a');
            a.href = '/Resume.pdf';
            a.download = 'Haridev_P_Resume.pdf';
            a.click();
            showToast('Starting Resume download...');
            onClose();
          }
        },
        {
          id: 'act-open-gitbook',
          title: 'Open Official GitBook',
          sub: 'haridev.gitbook.io/haridev',
          icon: BookOpen,
          action: () => {
            window.open(USER_CONFIG.gitbook, '_blank');
            onClose();
          }
        },
        {
          id: 'act-open-thm',
          title: 'TryHackMe Profile',
          sub: 'ArtemizZ (Top 30% Globally)',
          icon: ExternalLink,
          action: () => {
            window.open(USER_CONFIG.thmProfile, '_blank');
            onClose();
          }
        }
      ]
    }
  ];

  // Flatten filtered list
  const flatItems = [];
  COMMAND_ITEMS.forEach(cat => {
    cat.items.forEach(item => {
      const match =
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.sub.toLowerCase().includes(query.toLowerCase());
      if (match) {
        flatItems.push({ ...item, category: cat.category });
      }
    });
  });

  const handleClose = () => {
    setQuery('');
    setSelectedIndex(0);
    onClose();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (flatItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + flatItems.length) % (flatItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatItems[selectedIndex]) {
        flatItems[selectedIndex].action();
      }
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleClose}
      aria-label="Command Palette"
      className="w-[92vw] max-w-xl p-0 rounded-2xl bg-slate-950 text-zinc-100 border border-white/15 shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-sm fixed inset-0 m-auto overflow-hidden overscroll-contain"
    >
      <div className="p-4" onKeyDown={handleKeyDown}>
        {/* Search Header */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Type a command, tool, or section..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            autoFocus
            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm font-mono text-white placeholder:text-zinc-500 focus:outline-none focus:border-sky-400/50"
          />
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-white"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        {/* Toast confirmation */}
        {toastMessage && (
          <div className="mb-3 p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Check size={13} />
              {toastMessage}
            </span>
          </div>
        )}

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto space-y-1 pr-1">
          {flatItems.length > 0 ? (
            flatItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-2.5 rounded-lg flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-sky-500/15 border border-sky-500/30 text-white' : 'hover:bg-white/[0.04] text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-1.5 rounded-md ${
                      isSelected ? 'bg-sky-500/20 text-sky-300' : 'bg-white/[0.05] text-zinc-400'
                    }`}>
                      <Icon size={14} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-white truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] font-mono text-zinc-500 truncate">
                        {item.sub}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600 hidden sm:inline">
                    {item.category}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-xs font-mono text-zinc-500">
              No matching commands or actions found.
            </div>
          )}
        </div>

        {/* Keyboard hints footer */}
        <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <span>Use <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-300">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-300">↓</kbd> to navigate</span>
            <span>·</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-300">↵</kbd> to select</span>
          </div>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-300">Esc</kbd> to close</span>
        </div>
      </div>
    </dialog>
  );
}
