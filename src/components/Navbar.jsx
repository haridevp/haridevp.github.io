import React, { useState, useEffect } from 'react';
import {
  Github, Linkedin, Instagram, Braces, Menu, X, Download,
  Shield, Briefcase, FolderGit2, BookOpen, Send, Terminal, Radio
} from 'lucide-react';
import { USER_CONFIG } from '../data/config';

const NAV_ITEMS = [
  { id: 'about', label: 'About', icon: Shield },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'talks', label: 'Talks', icon: Terminal },
  { id: 'research', label: 'Research', icon: BookOpen },
  { id: 'blog', label: 'Blog', icon: BookOpen },
  { id: 'contact', label: 'Contact', icon: Send },
];

const DOCK_ITEMS = [
  { id: 'about', label: 'About', icon: Shield },
  { id: 'experience', label: 'Exp', icon: Briefcase },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'blog', label: 'Blog', icon: BookOpen },
  { id: 'contact', label: 'Contact', icon: Send },
];

const SOCIAL_LINKS = [
  { href: USER_CONFIG.github, icon: Github, label: 'GitHub' },
  { href: USER_CONFIG.linkedin, icon: Linkedin, label: 'LinkedIn' },
  { href: USER_CONFIG.googleDev, icon: Braces, label: 'Google Dev' },
  { href: USER_CONFIG.instagram, icon: Instagram, label: 'Instagram' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Detect active section
      const sections = NAV_ITEMS.map(item => document.getElementById(item.id));
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 140) {
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
    <>
      {/* Top Futuristic Telemetry Line (Desktop only) */}
      <div className="hidden lg:flex items-center justify-between px-6 py-1 bg-[#06070b]/90 border-b border-cyan-500/15 text-[11px] font-mono text-gray-400 fixed top-0 left-0 right-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Radio size={12} className="animate-pulse text-emerald-400" />
            NODE: <span className="text-white">ASTRA-LAB // CYSTAR</span>
          </span>
          <span className="text-gray-600">|</span>
          <span>CLEARANCE: <span className="text-emerald-400">RED TEAM LEVEL-3</span></span>
          <span className="text-gray-600">|</span>
          <span>CIPHER: <span className="text-gray-300">AES-256-GCM</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">TARGET ATT&CK MATRIX: <span className="text-cyan-400">ACTIVE</span></span>
          <span className="text-gray-600">|</span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            STATUS: <span className="text-emerald-400">ONLINE</span>
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`navbar lg:top-[29px] ${scrolled ? 'scrolled' : ''}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Futuristic Cyber Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="group flex items-center gap-2 text-base font-bold font-mono tracking-tight text-white hover:opacity-90 transition-opacity"
          >
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all">
              <Shield size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-wider leading-none text-white">
                HARIDEV<span className="text-cyan-400">.P</span>
              </span>
              <span className="text-[10px] font-mono text-gray-500 leading-tight">
                OFFSEC // REDTEAM
              </span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-link text-xs lg:text-sm ${activeSection === item.id ? 'active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/Resume.pdf"
              download="Haridev_P_Resume.pdf"
              className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 font-mono text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
            >
              <Download size={13} />
              RESUME.PDF
            </a>

            <div className="h-4 w-px bg-gray-800 ml-1" />

            {SOCIAL_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-cyan-400 transition-colors p-1"
                aria-label={link.label}
              >
                <link.icon size={16} />
              </a>
            ))}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href="/Resume.pdf"
              download="Haridev_P_Resume.pdf"
              className="inline-flex items-center gap-1 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 font-mono text-xs font-medium text-cyan-300"
            >
              <Download size={12} />
              CV
            </a>
            <button
              className="text-gray-400 hover:text-cyan-400 transition-colors p-2 rounded-lg border border-transparent hover:border-cyan-500/20"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={22} className="text-cyan-400" /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-Out Drawer */}
      <div className={`mobile-menu-drawer ${mobileOpen ? 'open' : ''}`}>
        <div className="flex flex-col gap-5 pt-8">
          <div className="text-[11px] font-mono tracking-wider text-cyan-400/80 uppercase pb-2 border-b border-cyan-500/20">
            // NAVIGATION DIRECTORY
          </div>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center justify-between text-left py-2.5 px-3 rounded-lg font-heading text-lg font-semibold transition-all ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-cyan-400' : 'text-gray-500'} />
                  <span>{item.label}</span>
                </div>
                {isActive && <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />}
              </button>
            );
          })}
        </div>

        <div className="space-y-4 pt-6 border-t border-gray-800">
          <a
            href="/Resume.pdf"
            download="Haridev_P_Resume.pdf"
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-cyan-500/40 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 py-3 font-mono text-sm font-semibold text-cyan-300"
          >
            <Download size={16} />
            DOWNLOAD UPDATED RESUME (PDF)
          </a>

          <div className="flex items-center justify-center gap-6 pt-2">
            {SOCIAL_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-cyan-400 transition-colors p-2"
                aria-label={link.label}
              >
                <link.icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Mobile Bottom Dock (One-Handed Navigation) */}
      <div className="mobile-bottom-dock md:hidden">
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
              <Icon size={16} className={isActive ? 'text-cyan-400' : 'text-gray-400'} />
              <span className="mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
