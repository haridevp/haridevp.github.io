import React, { useState, useEffect } from 'react';
import {
  Github, Linkedin, Instagram, Braces, Menu, X, Download,
  Briefcase, FolderGit2, BookOpen, Send, User, ExternalLink,
  ArrowUpRight, Search, Shield, Terminal, Award
} from 'lucide-react';
import { USER_CONFIG } from '../data/config';

const NAV_ITEMS = [
  { id: 'labs', label: 'Interactive Labs' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'writeups', label: 'Writeups' },
  { id: 'proof', label: 'Proof & Talks' },
  { id: 'about', label: 'Capabilities' },
  { id: 'contact', label: 'Contact' }
];

const DOCK_ITEMS = [
  { id: 'labs', label: 'Labs', icon: Terminal },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'experience', label: 'Exp', icon: Briefcase },
  { id: 'writeups', label: 'Notes', icon: BookOpen },
  { id: 'contact', label: 'Contact', icon: Send }
];

const SOCIAL_LINKS = [
  { href: USER_CONFIG.github, icon: Github, label: 'GitHub' },
  { href: USER_CONFIG.linkedin, icon: Linkedin, label: 'LinkedIn' },
  { href: USER_CONFIG.googleDev, icon: Braces, label: 'Google Dev' },
  { href: USER_CONFIG.instagram, icon: Instagram, label: 'Instagram' }
];

export default function Navbar({ onOpenCommandPalette }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('labs');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = NAV_ITEMS.map(item => document.getElementById(item.id));
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 160) {
            setActiveSection(NAV_ITEMS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id) => {
    setMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Minimalist Logo / Identity */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight text-white hover:opacity-90 transition-opacity"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="font-mono text-zinc-100 font-semibold tracking-tight">haridev.p</span>
          <span className="text-xs font-mono text-zinc-500 font-normal hidden lg:inline">
            / offsec & systems
          </span>
        </a>

        {/* Desktop Nav Items */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-5 lg:gap-6">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`nav-link text-xs lg:text-sm font-medium transition-colors cursor-pointer ${
                activeSection === item.id ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Quick Command Palette Trigger */}
          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-zinc-400 hover:text-white transition-all cursor-pointer"
              title="Open command palette (Ctrl+K or ⌘K)"
            >
              <Search size={13} />
              <span className="hidden xl:inline text-[11px]">Command</span>
              <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-[10px] text-zinc-300">
                ⌘K
              </kbd>
            </button>
          )}

          <a
            href={USER_CONFIG.gitbook}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gitbook text-xs py-1.5 px-3 flex items-center gap-1.5"
            title="Read writeups & research on GitBook"
          >
            <BookOpen size={13} />
            <span>GitBook</span>
            <ArrowUpRight size={12} className="opacity-70" />
          </a>

          <a
            href="/Resume.pdf"
            download="Haridev_P_Resume.pdf"
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <Download size={13} />
            <span>Resume</span>
          </a>

          <div className="h-4 w-px bg-white/10 mx-0.5" />

          {SOCIAL_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-white transition-colors p-1"
              aria-label={link.label}
            >
              <link.icon size={15} />
            </a>
          ))}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="p-1.5 rounded-lg bg-white/[0.05] text-zinc-400 hover:text-white border border-white/10"
              aria-label="Open command search"
            >
              <Search size={16} />
            </button>
          )}

          <a
            href={USER_CONFIG.gitbook}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gitbook text-xs py-1 px-2.5 flex items-center gap-1"
          >
            <BookOpen size={12} />
            <span>GitBook</span>
            <ArrowUpRight size={11} />
          </a>

          <button
            className="text-zinc-400 hover:text-white transition-colors p-2 rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Out Drawer */}
      <div className={`mobile-menu-drawer ${mobileOpen ? 'open' : ''}`}>
        <div className="flex flex-col gap-3 pt-4">
          <div className="text-xs font-mono tracking-wider text-zinc-400 uppercase pb-2 border-b border-white/10">
            Navigation Index
          </div>
          {NAV_ITEMS.map(item => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center justify-between text-left py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white bg-white/10 font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
              </button>
            );
          })}
        </div>

        <div className="space-y-3 pt-6 border-t border-white/10">
          <a
            href={USER_CONFIG.gitbook}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-sky-500/30 bg-sky-500/10 py-2.5 text-sm font-medium text-sky-300"
          >
            <BookOpen size={15} />
            <span>Open Haridev's GitBook Space</span>
            <ExternalLink size={13} />
          </a>

          <a
            href="/Resume.pdf"
            download="Haridev_P_Resume.pdf"
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-zinc-200"
          >
            <Download size={15} />
            <span>Download Resume (PDF)</span>
          </a>

          <div className="flex items-center justify-center gap-6 pt-2">
            {SOCIAL_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-white transition-colors p-2"
                aria-label={link.label}
              >
                <link.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Mobile Bottom Dock */}
      <nav aria-label="Mobile Dock Navigation" className="mobile-bottom-dock md:hidden">
        {DOCK_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`dock-item ${isActive ? 'active' : ''}`}
              aria-label={`Scroll to ${item.label}`}
            >
              <Icon size={15} />
              <span className="mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
