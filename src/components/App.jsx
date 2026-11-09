import React, { useState, useEffect } from 'react';
import {
  ArrowRight, ExternalLink, Globe, Download, Github, Linkedin,
  Mail, Instagram, Braces, FileText, Award, BookOpen, ChevronRight,
  ArrowUpRight, Clock, Hash, Lock, Search, X, Cloud, Shield,
  Terminal, Briefcase, Mic, CheckCircle2, Phone, MapPin, Sparkles,
  ChevronDown, ChevronUp, Send, Bookmark, Cpu, Layers, Copy, Check, Key
} from 'lucide-react';

import Navbar from './Navbar';
import Section from './Section';
import C2ProtocolDissector from './C2ProtocolDissector';
import ActiveDirectoryLabVisualizer from './ActiveDirectoryLabVisualizer';
import WriteupsBrowser from './WriteupsBrowser';
import ProofOfWork from './ProofOfWork';
import CommandPalette from './CommandPalette';

import { USER_CONFIG } from '../data/config';
import { RESUME_DATA } from '../data/resume';

// Dev mode admin
const AdminPage = import.meta.env.DEV
  ? React.lazy(() => import('./AdminPage'))
  : null;

export default function App() {
  const [lastCommit, setLastCommit] = useState("Loading...");
  const [showAdmin, setShowAdmin] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState({});
  const [activeProjectFilter, setActiveProjectFilter] = useState('all'); // 'all' | 'offsec' | 'systems'
  const [activeLabTab, setActiveLabTab] = useState('c2'); // 'c2' | 'ad'
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPgp, setCopiedPgp] = useState(false);

  const toggleProjectExpand = (idx) => {
    setExpandedProjects(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + "y ago";
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + "mo ago";
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + "d ago";
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + "h ago";
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + "m ago";
    return Math.floor(seconds) + "s ago";
  };

  // Keyboard shortcut listener (Ctrl+K / Cmd+K for Command Palette, Ctrl+Shift+A for Admin)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
      if (import.meta.env.DEV && e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowAdmin(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchLastCommit = async () => {
      try {
        const response = await fetch('https://api.github.com/users/haridevp/events');
        const data = await response.json();
        const pushEvent = data.find(event => event.type === 'PushEvent');
        if (pushEvent) {
          setLastCommit(getTimeAgo(pushEvent.created_at));
        } else {
          setLastCommit("Recent");
        }
      } catch {
        setLastCommit("Active");
      }
    };
    fetchLastCommit();
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(USER_CONFIG.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPgp = () => {
    navigator.clipboard.writeText(USER_CONFIG.pgpKey);
    setCopiedPgp(true);
    setTimeout(() => setCopiedPgp(false), 2000);
  };

  if (showAdmin && AdminPage) {
    return (
      <React.Suspense fallback={<div className="p-8 text-white">Loading Admin...</div>}>
        <AdminPage onClose={() => setShowAdmin(false)} />
      </React.Suspense>
    );
  }

  const filteredProjects = RESUME_DATA.projects.filter(p => {
    if (activeProjectFilter === 'all') return true;
    return p.category === activeProjectFilter;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-zinc-100 selection:bg-sky-500/30 selection:text-sky-100">
      {/* Navigation & Header */}
      <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* =========================================================
          HERO SECTION — High-Signal, Confident & Authentic
          ========================================================= */}
      <header className="pt-28 pb-16 sm:pt-36 sm:pb-20 border-b border-white/[0.08] relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Top Status & Affiliation Bar */}
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <div className="status-badge">
              <span className="status-dot" />
              <span>Security Research Intern @ ASTRA Lab, IIT Madras</span>
            </div>
            <div className="status-badge-neutral font-mono text-[11px]">
              Available for Red Team / OffSec Engineering
            </div>
            <div className="status-badge-neutral font-mono text-[11px] text-zinc-400">
              GitHub Active: {lastCommit}
            </div>
          </div>

          {/* Heading & Subtitle */}
          <div className="space-y-3 mb-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
              Haridev P
            </h1>
            <p className="text-lg sm:text-xl font-normal text-zinc-300">
              {USER_CONFIG.role}
            </p>
          </div>

          {/* Authentic First-Person Bio */}
          <p className="text-base text-zinc-300 leading-relaxed max-w-3xl mb-8">
            Computer Science student at Amrita Vishwa Vidyapeetham and Security Research Intern at <span className="text-white font-medium">ASTRA Lab (CyStar), IIT Madras</span> working under Prof. Narayanaswamy N S and Dr. Jaimandeep Singh (Senior Consultant, ex-Ministry of Defence). My core focus is offensive security: building covert Command & Control conduits, simulating Active Directory attack chains, and researching Windows internals evasion. I also build distributed systems in Go and real-time collaborative workspaces.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <a href="#labs" className="btn-primary">
              <Terminal size={15} />
              <span>Explore Interactive Labs</span>
            </a>

            <a
              href={USER_CONFIG.gitbook}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gitbook"
            >
              <BookOpen size={15} />
              <span>Haridev's GitBook</span>
              <ArrowUpRight size={14} className="opacity-70" />
            </a>

            <a
              href="/Resume.pdf"
              download="Haridev_P_Resume.pdf"
              className="btn-secondary"
            >
              <Download size={14} />
              <span>Resume (PDF)</span>
            </a>

            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="btn-secondary font-mono text-xs hidden sm:inline-flex"
            >
              <Search size={13} />
              <span>Press ⌘K for Commands</span>
            </button>
          </div>

          {/* Telemetry / Proof Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/[0.08]">
            <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[11px] font-mono text-zinc-500 uppercase">Research Lab</div>
              <div className="font-semibold text-sm text-zinc-200 mt-0.5">ASTRA Lab, IITM</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">CyStar Research</div>
            </div>
            <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[11px] font-mono text-zinc-500 uppercase">TryHackMe</div>
              <div className="font-semibold text-sm text-emerald-400 mt-0.5">Top 30% Globally</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">24 Writeups Documented</div>
            </div>
            <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[11px] font-mono text-zinc-500 uppercase">Hack The Box</div>
              <div className="font-semibold text-sm text-sky-400 mt-0.5">Level 12 • 13 Roots</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Guided Tracks Tier 0–2</div>
            </div>
            <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[11px] font-mono text-zinc-500 uppercase">Publications</div>
              <div className="font-semibold text-sm text-indigo-300 mt-0.5">Springer LNNS</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Scopus-Indexed Author</div>
            </div>
          </div>
        </div>
      </header>

      <main className="pb-28 md:pb-12">
        {/* =========================================================
            INTERACTIVE LABS SECTION (Stealth-C2 & Active Directory Lab)
            ========================================================= */}
        <Section id="labs" className="border-b border-white/[0.08]">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono text-sky-400 bg-sky-500/10 border border-sky-500/20 mb-2">
                <Terminal size={12} />
                <span>Hands-on Engineering Architecture</span>
              </div>
              <h2 className="section-title">Interactive Security Labs</h2>
              <p className="section-subtitle">
                Explore the protocol dissection and attack chain simulation of Haridev's offensive security frameworks.
              </p>
            </div>

            {/* Lab Switcher Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl self-start sm:self-auto flex-shrink-0">
              <button
                type="button"
                onClick={() => setActiveLabTab('c2')}
                className={`text-xs font-mono px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeLabTab === 'c2'
                    ? 'bg-sky-500/20 text-white font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Stealth-C2 Protocol
              </button>
              <button
                type="button"
                onClick={() => setActiveLabTab('ad')}
                className={`text-xs font-mono px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeLabTab === 'ad'
                    ? 'bg-indigo-500/20 text-white font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Active Directory Lab
              </button>
            </div>
          </div>

          {/* Active Lab Component */}
          {activeLabTab === 'c2' ? (
            <div id="c2-lab">
              <C2ProtocolDissector />
            </div>
          ) : (
            <div id="ad-lab">
              <ActiveDirectoryLabVisualizer />
            </div>
          )}
        </Section>

        {/* =========================================================
            SELECTED ENGINEERING PROJECTS
            ========================================================= */}
        <Section id="projects" className="border-b border-white/[0.08]">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div className="max-w-xl">
              <h2 className="section-title">Selected Projects</h2>
              <p className="section-subtitle">
                Adversary simulation frameworks, distributed key-value storage in Go, and cryptographic architectures.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-white/[0.03] p-1 rounded-lg border border-white/[0.06] self-start sm:self-auto flex-shrink-0">
              <button
                type="button"
                onClick={() => setActiveProjectFilter('all')}
                className={`text-xs font-mono px-2.5 py-1 rounded transition-colors cursor-pointer whitespace-nowrap ${
                  activeProjectFilter === 'all'
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                All ({RESUME_DATA.projects.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveProjectFilter('offsec')}
                className={`text-xs font-mono px-2.5 py-1 rounded transition-colors cursor-pointer whitespace-nowrap ${
                  activeProjectFilter === 'offsec'
                    ? 'bg-sky-500/20 text-sky-300 font-medium'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                OffSec & C2
              </button>
              <button
                type="button"
                onClick={() => setActiveProjectFilter('systems')}
                className={`text-xs font-mono px-2.5 py-1 rounded transition-colors cursor-pointer whitespace-nowrap ${
                  activeProjectFilter === 'systems'
                    ? 'bg-indigo-500/20 text-indigo-300 font-medium'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Systems & Tools
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredProjects.map((project, idx) => {
              const isExpanded = !!expandedProjects[idx];
              return (
                <div key={idx} className="card p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="tag text-[11px] font-mono">
                        {project.badge}
                      </span>

                      <div className="flex items-center gap-2">
                        {project.liveLink && (
                          <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-white transition-colors"
                            title="Live Platform Demo"
                          >
                            <Globe size={15} />
                          </a>
                        )}
                        {project.releaseLink && (
                          <a
                            href={project.releaseLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1"
                            title="GitHub Release"
                          >
                            <span>Release</span>
                            <ArrowUpRight size={13} />
                          </a>
                        )}
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-white transition-colors"
                            title="Source Code on GitHub"
                          >
                            <ArrowUpRight size={16} />
                          </a>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-zinc-500 font-mono mb-3">{project.period}</p>

                    {project.mitreTactic && (
                      <div className="mb-3">
                        <span className="tag-mitre text-[11px] font-mono px-2 py-0.5 rounded inline-flex items-center gap-1">
                          <Shield size={11} />
                          {project.mitreTactic}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tech.split(', ').map((tech, tIdx) => (
                        <span key={tIdx} className="tag text-[11px] text-zinc-400">{tech}</span>
                      ))}
                    </div>

                    <ul className="space-y-1.5 mb-3">
                      {project.details.slice(0, isExpanded ? undefined : 2).map((detail, dIdx) => (
                        <li key={dIdx} className="text-xs sm:text-sm text-zinc-300 leading-relaxed flex items-start">
                          <span className="text-zinc-600 mr-2">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {project.details.length > 2 && (
                    <button
                      type="button"
                      onClick={() => toggleProjectExpand(idx)}
                      className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 mt-2 pt-2 border-t border-white/[0.06] cursor-pointer"
                    >
                      {isExpanded ? (
                        <>Show Less <ChevronUp size={12} /></>
                      ) : (
                        <>Read Technical Specifications <ChevronDown size={12} /></>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </Section>

        {/* =========================================================
            EXPERIENCE & WORKSHOP BRIEFINGS SECTION
            ========================================================= */}
        <Section id="experience" className="border-b border-white/[0.08]">
          <div className="mb-8">
            <h2 className="section-title">Research & Experience</h2>
            <p className="section-subtitle">
              Academic research engagements, adversary emulation, and technical workshop training.
            </p>
          </div>

          <div className="space-y-6">
            {/* ASTRA Lab, IIT Madras */}
            {RESUME_DATA.experience.map((exp, idx) => (
              <div key={idx} className="card p-6 sm:p-7">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4 pb-4 border-b border-white/[0.06]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="tag text-xs text-emerald-400 border-emerald-500/20 bg-emerald-500/5">
                        Active Internship
                      </span>
                      <span className="text-xs font-mono text-zinc-500">{exp.location}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white">
                      {exp.role}
                    </h3>
                    <p className="text-sm font-medium text-zinc-300">
                      {exp.organization}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs font-mono text-zinc-400 font-medium">
                      {exp.period}
                    </span>
                    {exp.mentors && (
                      <p className="text-xs text-zinc-500 font-mono mt-0.5">
                        Advisors: {exp.mentors}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2.5 mb-5">
                  {exp.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2.5 text-sm text-zinc-300 leading-relaxed">
                      <span className="text-zinc-500 mt-1">•</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.06]">
                  {exp.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="tag text-[11px]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {/* DeepTrustxAI Workshop Speaker Card */}
            {RESUME_DATA.talks && RESUME_DATA.talks.map((talk, idx) => (
              <div key={idx} className="card p-6 sm:p-7 border-purple-500/20 bg-gradient-to-r from-purple-950/20 via-slate-900/40 to-slate-900/60">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4 pb-4 border-b border-white/[0.06]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="tag text-xs text-purple-300 border-purple-500/30 bg-purple-500/10">
                        <Mic size={12} className="mr-1 inline" />
                        Invited Workshop Speaker
                      </span>
                      <span className="text-xs font-mono text-zinc-500">{talk.period}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white">
                      {talk.title}
                    </h3>
                    <p className="text-sm font-medium text-purple-200/80">
                      {talk.event}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs font-mono text-zinc-400">
                      Audience: {talk.audience}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {talk.details.map((detail, dIdx) => (
                    <p key={dIdx} className="text-sm text-zinc-300 leading-relaxed">
                      {detail}
                    </p>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.06]">
                  {talk.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="tag text-[11px] text-purple-300/80">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* =========================================================
            CTF WRITEUPS & DOCUMENTATION (24 Full AoC Walkthroughs)
            ========================================================= */}
        <Section id="writeups" className="border-b border-white/[0.08]">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono text-sky-400 bg-sky-500/10 border border-sky-500/20 mb-2">
                <BookOpen size={12} />
                <span>24 Hand-Documented Solutions</span>
              </div>
              <h2 className="section-title">Writeups & Security Notes</h2>
              <p className="section-subtitle">
                Advent of Cyber 2025 machine walkthroughs, Active Directory attack paths, and registry forensics.
              </p>
            </div>

            <a
              href={USER_CONFIG.gitbook}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gitbook self-start md:self-auto flex items-center gap-2"
            >
              <span>Visit haridev.gitbook.io</span>
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Embed the rich WriteupsBrowser */}
          <WriteupsBrowser />
        </Section>

        {/* =========================================================
            PROOF OF WORK & VERIFICATIONS
            ========================================================= */}
        <Section id="proof" className="border-b border-white/[0.08]">
          <div className="mb-8">
            <h2 className="section-title">Proof of Work & Credentials</h2>
            <p className="section-subtitle">
              Verified competitive lab rankings, peer-reviewed scientific publications, and certifications.
            </p>
          </div>

          <ProofOfWork />
        </Section>

        {/* =========================================================
            PEER-REVIEWED RESEARCH & PUBLICATIONS
            ========================================================= */}
        {RESUME_DATA.publications && RESUME_DATA.publications.length > 0 && (
          <Section id="research" className="border-b border-white/[0.08]">
            <div className="mb-8">
              <h2 className="section-title">Research & Publications</h2>
              <p className="section-subtitle">
                Peer-reviewed conference proceedings indexed in Scopus and Springer LNNS.
              </p>
            </div>

            <div className="space-y-4">
              {RESUME_DATA.publications.map((pub, idx) => (
                <div key={idx} className="card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/[0.05] border border-white/10 text-zinc-300">
                      <BookOpen size={16} />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="tag text-xs text-emerald-400 border-emerald-500/20 bg-emerald-500/5">
                          <CheckCircle2 size={11} className="mr-1 inline" />
                          {pub.status}
                        </span>
                        {pub.role && (
                          <span className="tag text-xs text-zinc-400">
                            {pub.role}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-white">
                        {pub.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-400 font-mono">
                        {pub.publisher}
                      </p>
                      <ul className="space-y-1 pt-1 text-xs sm:text-sm text-zinc-400">
                        {pub.details.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* =========================================================
            ABOUT & CAPABILITIES SECTION
            ========================================================= */}
        <Section id="about" className="border-b border-white/[0.08]">
          <div className="mb-8">
            <h2 className="section-title">Capabilities & Education</h2>
            <p className="section-subtitle">
              Technical tradecraft breakdown, systems background, and academic credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
            {/* Left Column: Skills Breakdown */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Technical Tradecraft Matrix
              </h3>
              <div className="space-y-3">
                {RESUME_DATA.skills.map((group, idx) => (
                  <div key={idx} className="card p-4">
                    <p className="text-xs text-zinc-400 font-mono uppercase font-semibold mb-2">
                      {group.category}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((skill, sIdx) => (
                        <span key={sIdx} className="tag text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Education & Academic Credentials */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
                  Academic Education
                </h3>
                <div className="space-y-3">
                  {RESUME_DATA.education.map((edu, idx) => (
                    <div key={idx} className="card p-4">
                      <h4 className="font-semibold text-white text-sm">
                        {edu.institution}
                      </h4>
                      <p className="text-xs text-zinc-300 font-mono mt-0.5">
                        {edu.degree}
                      </p>
                      <p className="text-xs text-zinc-500 font-mono mt-0.5">{edu.period}</p>
                      {edu.details && (
                        <p className="text-xs text-zinc-400 mt-2">
                          {edu.details.join(' ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Platforms Summary */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
                  Active Security Handles
                </h3>
                <div className="space-y-2.5">
                  <div className="card p-3.5 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold text-white">TryHackMe</div>
                      <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                        User: ArtemizZ (Top 30%)
                      </div>
                    </div>
                    <a
                      href={USER_CONFIG.thmProfile}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      Profile <ExternalLink size={11} />
                    </a>
                  </div>

                  <div className="card p-3.5 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold text-white">Hack The Box</div>
                      <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                        Level 12 • 13 Machines
                      </div>
                    </div>
                    <a
                      href={USER_CONFIG.htbProfile}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono text-sky-400 hover:underline flex items-center gap-1"
                    >
                      Platform <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* =========================================================
            CONTACT SECTION — Clean, Respectful & Actionable
            ========================================================= */}
        <Section id="contact">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="section-title">Get in Touch</h2>
            <p className="section-subtitle mx-auto">
              Open for offensive security roles, red team simulation engagements, and security research collaborations.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            {/* Direct Contact Cards with Copy Support */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div
                onClick={handleCopyEmail}
                className="card p-4 cursor-pointer group hover:border-zinc-500 transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-mono text-zinc-500 uppercase mb-1">
                  <span>Email</span>
                  {copiedEmail ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} className="opacity-60 group-hover:opacity-100" />}
                </div>
                <div className="text-xs font-mono text-zinc-200 group-hover:text-white break-all">
                  {USER_CONFIG.email}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 mt-1">
                  {copiedEmail ? 'Copied to clipboard!' : 'Click to copy'}
                </div>
              </div>

              <div className="card p-4 text-left">
                <div className="text-xs font-mono text-zinc-500 uppercase mb-1">Telephone</div>
                <a href={`tel:${USER_CONFIG.phone}`} className="text-xs font-mono text-zinc-200 hover:text-white">
                  {USER_CONFIG.phone}
                </a>
                <div className="text-[10px] font-mono text-zinc-500 mt-1">
                  Direct Line
                </div>
              </div>

              <div className="card p-4 text-left">
                <div className="text-xs font-mono text-zinc-500 uppercase mb-1">Location</div>
                <div className="text-xs font-mono text-zinc-200">
                  {USER_CONFIG.location}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 mt-1">
                  ASTRA Lab / Kerala
                </div>
              </div>
            </div>

            {/* PGP Fingerprint Card */}
            <div
              onClick={handleCopyPgp}
              className="card p-4 cursor-pointer group hover:border-zinc-500 transition-colors flex items-center justify-between gap-4 text-left"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase mb-1">
                  <Key size={13} className="text-sky-400" />
                  <span>PGP Public Key Fingerprint</span>
                </div>
                <div className="text-xs font-mono text-zinc-300 font-semibold truncate">
                  {USER_CONFIG.pgpKey}
                </div>
              </div>
              <div className="flex-shrink-0 text-xs font-mono text-zinc-400 group-hover:text-white flex items-center gap-1">
                {copiedPgp ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copiedPgp ? 'Copied' : 'Copy'}</span>
              </div>
            </div>

            {/* Draft an Email Quick Compose */}
            <div className="card p-6 text-left">
              <h4 className="text-sm font-semibold text-white mb-1">
                Start a Conversation
              </h4>
              <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                Clicking send will open your default email client with your message pre-formatted.
              </p>

              <form
                className="space-y-3.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const sender = formData.get('sender');
                  const subject = formData.get('subject') || 'Security Inquiry';
                  const message = formData.get('message');
                  window.location.href = `mailto:${USER_CONFIG.email}?subject=${encodeURIComponent(String(subject))}&body=${encodeURIComponent(String(message))}%0D%0A%0D%0AFrom:%20${encodeURIComponent(String(sender))}`;
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Your Name</label>
                    <input name="sender" required type="text" className="form-input" placeholder="e.g. Alex Vance" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Subject</label>
                    <input name="subject" required type="text" className="form-input" placeholder="e.g. Red Team Opportunity / Collaboration" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Message</label>
                  <textarea name="message" required rows={4} className="form-input resize-none" placeholder="Your opportunity details, project scope, or inquiry..."></textarea>
                </div>
                <button type="submit" className="btn-primary w-full justify-center cursor-pointer">
                  <Send size={15} />
                  <span>Send via Email Client</span>
                </button>
              </form>
            </div>
          </div>
        </Section>
      </main>

      {/* =========================================================
          FOOTER
          ========================================================= */}
      <footer className="border-t border-white/[0.08] py-8 text-xs font-mono text-zinc-500 pb-24 md:pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p>© {new Date().getFullYear()} {USER_CONFIG.username} · ASTRA Lab (CyStar), IIT Madras</p>
            <p className="text-[11px] text-zinc-600 mt-0.5">Press ⌘K or Ctrl+K anytime for command palette</p>
          </div>
          <div className="flex items-center gap-4">
            <a href={USER_CONFIG.gitbook} target="_blank" rel="noreferrer" className="hover:text-zinc-300 transition-colors">
              GitBook
            </a>
            <a href={USER_CONFIG.github} target="_blank" rel="noreferrer" className="hover:text-zinc-300 transition-colors">
              GitHub
            </a>
            <a href={USER_CONFIG.linkedin} target="_blank" rel="noreferrer" className="hover:text-zinc-300 transition-colors">
              LinkedIn
            </a>
            <a href={USER_CONFIG.thmProfile} target="_blank" rel="noreferrer" className="hover:text-zinc-300 transition-colors">
              TryHackMe
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
