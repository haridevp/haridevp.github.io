import React, { useState, useEffect } from 'react';
import {
  ArrowRight, ExternalLink, Globe, Download, Github, Linkedin,
  Mail, Instagram, Braces, FileText, Award, BookOpen, ChevronRight,
  ArrowUpRight, Clock, Hash, Lock, Search, X, Cloud, Shield,
  Terminal, Briefcase, Mic, CheckCircle2, Phone, MapPin, Sparkles,
  Layers, Radio, ChevronDown, ChevronUp, Send
} from 'lucide-react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkAlert } from 'remark-github-blockquote-alert';
import 'github-markdown-css/github-markdown-dark.css';
import 'katex/dist/katex.min.css';

import CodeBlock from './CodeBlock';
import Navbar from './Navbar';
import Section from './Section';
import CyberCanvas from './CyberCanvas';
import CyberConsole from './CyberConsole';

import { USER_CONFIG } from '../data/config';
import { RESUME_DATA } from '../data/resume';
import { BLOG_POSTS } from '../data/blog';
import { TROPHIES } from '../data/trophies';

// AdminPage is lazy-loaded and only available in dev mode
const AdminPage = import.meta.env.DEV
  ? React.lazy(() => import('./AdminPage'))
  : null;

export default function App() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [visiblePostsCount, setVisiblePostsCount] = useState(5);
  const [lastCommit, setLastCommit] = useState("Loading...");
  const [showAdmin, setShowAdmin] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState({});

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

  // Secret admin access via Ctrl+Shift+A (dev mode only)
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
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

    // Discord webhook notification (quietly fails if unset)
    const notifyVisit = async () => {
      const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
      if (!webhookUrl || sessionStorage.getItem('notified')) return;

      try {
        let ipv4 = "Unknown", ipv6 = "Not Detected", location = "Unknown", isp = "Unknown";
        try {
          const v4Res = await fetch('https://api.ipify.org?format=json');
          ipv4 = (await v4Res.json()).ip;
        } catch {
          // IP fetch failed
        }
        try {
          const v6Res = await fetch('https://api6.ipify.org?format=json');
          ipv6 = (await v6Res.json()).ip;
        } catch {
          // IPv6 fetch failed
        }
        try {
          const locRes = await fetch('https://ipapi.co/json/');
          const locData = await locRes.json();
          if (!locData.error) {
            location = `${locData.city}, ${locData.country_code}`;
            isp = locData.org;
          }
        } catch {
          // Location fetch failed
        }

        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `🚨 **Incoming Connection Detected**\n**IPv4:** ${ipv4}\n**IPv6:** ${ipv6}\n**Location:** ${location}\n**ISP:** ${isp}\n**User Agent:** ${navigator.userAgent}`
          })
        });
        sessionStorage.setItem('notified', 'true');
      } catch {
        // Notification failed silently
      }
    };
    notifyVisit();
  }, []);

  // Admin overlay
  if (showAdmin && import.meta.env.DEV && AdminPage) {
    return (
      <React.Suspense fallback={<div className="text-center text-gray-500 font-mono p-10">Loading admin...</div>}>
        <AdminPage onBack={() => setShowAdmin(false)} />
      </React.Suspense>
    );
  }

  // Blog post reader modal
  if (selectedPost) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] relative">
        <CyberCanvas />
        <Navbar />
        <div className="relative z-10 pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => setSelectedPost(null)}
            className="btn-secondary mb-8 text-sm"
          >
            ← Back to Blog
          </button>

          <div className="mb-8 border-b border-cyan-500/20 pb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="tag">
                <Hash size={12} className="mr-1" />
                {selectedPost.category}
              </span>
              <span className={`tag ${
                selectedPost.difficulty === 'Hard' || selectedPost.difficulty === 'Critical'
                  ? '!bg-red-500/10 !text-red-400 !border-red-500/20'
                  : selectedPost.difficulty === 'Medium'
                  ? '!bg-amber-500/10 !text-amber-400 !border-amber-500/20'
                  : '!bg-emerald-500/10 !text-emerald-400 !border-emerald-500/20'
              }`}>
                <Lock size={12} className="mr-1" />
                {selectedPost.difficulty}
              </span>
              <span className="tag tag-neutral">
                <Clock size={12} className="mr-1" />
                {selectedPost.readTime}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-heading text-white mb-3 leading-tight">
              {selectedPost.title}
            </h1>
            <p className="text-xs sm:text-sm text-cyan-400/80 font-mono">PUBLISHED: {selectedPost.date}</p>
          </div>

          <div className="markdown-body bg-black/30 p-6 rounded-xl border border-cyan-500/15">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks, remarkAlert, remarkMath]}
              rehypePlugins={[rehypeRaw, rehypeKatex]}
              components={{
                pre: ({ children }) => {
                  if (React.isValidElement(children) && children.type === 'code') {
                    const { className, children: codeChildren } = children.props;
                    const match = /language-(\w+)/.exec(className || '');
                    const language = match ? match[1] : 'text';
                    return (
                      <CodeBlock
                        code={String(codeChildren).replace(/\n$/, '')}
                        language={language}
                      />
                    );
                  }
                  return <pre>{children}</pre>;
                }
              }}
            >
              {selectedPost.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  const filteredPosts = BLOG_POSTS.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Interactive Cyber Canvas */}
      <CyberCanvas />

      {/* Navigation */}
      <Navbar />

      {/* =========================================================
          HERO SECTION — Futuristic Cyber Command Center
          ========================================================= */}
      <div className="hero-gradient pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28 relative z-10 cyber-grid-overlay">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Top Status Indicators */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="status-badge-cyber">
              <span className="status-dot-cyan"></span>
              <span className="font-mono text-xs font-semibold tracking-wide">
                ASTRA LAB (CyStar), IIT MADRAS
              </span>
            </div>
            <div className="status-badge">
              <span className="status-dot"></span>
              <span className="font-mono text-xs font-semibold">
                Available for Red Team / OffSec
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-950/30 text-xs font-mono text-gray-300">
              <span className="text-gray-500">Last commit:</span>
              <span className="text-cyan-400 font-semibold">{lastCommit}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Heading, Role, Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <p className="font-mono text-xs uppercase tracking-widest text-cyan-400">
                  // OFFENSIVE SECURITY RESEARCHER & ADVERSARY EMULATOR
                </p>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-heading text-white tracking-tight leading-[1.05]">
                  Haridev <span className="gradient-text">P</span>
                </h1>
                <p className="text-lg sm:text-xl font-medium text-gray-300 font-heading">
                  {USER_CONFIG.role}
                </p>
              </div>

              <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-xl">
                {RESUME_DATA.summary}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
                <a href="#experience" className="btn-primary">
                  <span>View Experience</span>
                  <ArrowRight size={16} />
                </a>

                <a href="#projects" className="btn-secondary">
                  <span>Selected Projects</span>
                  <ChevronRight size={16} />
                </a>

                <a
                  href="/Resume.pdf"
                  download="Haridev_P_Resume.pdf"
                  className="btn-secondary group border-cyan-500/40 text-cyan-300 hover:border-cyan-400"
                  title="Download Haridev P Single Page Resume"
                >
                  <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
                  <span>Resume (PDF)</span>
                </a>
              </div>

              {/* Telemetry Quick Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-cyan-500/15">
                <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/20">
                  <div className="text-[10px] font-mono text-gray-400 uppercase">Affiliation</div>
                  <div className="font-mono font-bold text-xs sm:text-sm text-cyan-300 truncate">IIT Madras</div>
                </div>
                <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/20">
                  <div className="text-[10px] font-mono text-gray-400 uppercase">TryHackMe</div>
                  <div className="font-mono font-bold text-xs sm:text-sm text-emerald-400">Top 30%</div>
                </div>
                <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/20">
                  <div className="text-[10px] font-mono text-gray-400 uppercase">Hack The Box</div>
                  <div className="font-mono font-bold text-xs sm:text-sm text-amber-300">Level 12</div>
                </div>
                <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/20">
                  <div className="text-[10px] font-mono text-gray-400 uppercase">Publications</div>
                  <div className="font-mono font-bold text-xs sm:text-sm text-blue-300">Scopus (LNNS)</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Cyber Console */}
            <div className="lg:col-span-5 w-full">
              <CyberConsole />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          ABOUT SECTION — Bio, Philosophy, Arsenal & Education
          ========================================================= */}
      <Section id="about" className="relative z-10 border-t border-cyan-500/10">
        <div className="section-divider"></div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="section-title">About Me</h2>
            <p className="section-subtitle">
              Offensive security researcher background, skills matrix & academic credentials
            </p>
          </div>
          <span className="font-mono text-xs px-3 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 self-start sm:self-auto">
            OPERATOR IDENT: {USER_CONFIG.handle}
          </span>
        </div>

        {/* Operator Profile Dossier */}
        <div className="card border-cyan-500/30 bg-gradient-to-br from-[#0c1322] via-[#090d18] to-[#070913] p-6 sm:p-8 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-md bg-cyan-500/10 px-2.5 py-1 text-xs font-mono text-cyan-300 border border-cyan-500/25">
                <Shield size={13} className="text-cyan-400" />
                <span>OPERATOR PROFILE // {USER_CONFIG.username.toUpperCase()}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                Offensive Security Researcher & Adversary Emulation Specialist
              </h3>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                I am a Computer Science researcher and offensive security specialist focused on adversary emulation, Active Directory exploitation, and covert Command &amp; Control (C2) infrastructure development. Currently researching at <span className="text-cyan-300 font-semibold">{USER_CONFIG.lab}</span> under Prof. Narayanaswamy N S and Dr. Jaimandeep Singh, studying adversary tradecraft, initial access methodologies, and Windows internals evasion strategies.
              </p>

              <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-xs font-mono text-gray-400">
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-cyan-400" /> {RESUME_DATA.contact.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles size={13} className="text-emerald-400" /> Status: Available for OffSec / Red Team Roles
                </span>
                <span className="flex items-center gap-1.5">
                  <Terminal size={13} className="text-cyan-400" /> Focus: C2 Infrastructure &amp; Windows Internals
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-cyan-500/20 pt-4 lg:pt-0 lg:pl-6 space-y-3">
              <div className="text-[11px] font-mono text-cyan-400/80 uppercase tracking-wider">
                // CORE ENGAGEMENT METRICS
              </div>
              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-cyan-500/15">
                  <span className="text-gray-400">Lab Research</span>
                  <span className="text-cyan-300 font-bold">CipherC2 @ IITM</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-cyan-500/15">
                  <span className="text-gray-400">Adversary Tactics</span>
                  <span className="text-emerald-300 font-bold">MITRE ATT&amp;CK Matrix</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-cyan-500/15">
                  <span className="text-gray-400">TryHackMe</span>
                  <span className="text-amber-300 font-bold">ArtemizZ (Top 30%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Skills Matrix */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <Terminal size={15} />
              Offensive Security Arsenal &amp; Skills
            </h3>

            <div className="space-y-5">
              {RESUME_DATA.skills.map((group, idx) => (
                <div key={idx} className="card p-4 sm:p-5">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-mono mb-3">
                    // {group.category}
                  </p>
                  <div className="flex flex-wrap gap-2">
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

          {/* Right Column: Education & Certifications */}
          <div className="lg:col-span-5 space-y-8">
            {/* Education */}
            <div>
              <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
                <BookOpen size={15} />
                Education
              </h3>
              <div className="space-y-4">
                {RESUME_DATA.education.map((edu, idx) => (
                  <div key={idx} className="card p-4 sm:p-5">
                    <h4 className="font-bold font-heading text-white text-base mb-1">
                      {edu.institution}
                    </h4>
                    <p className="text-sm font-medium text-cyan-300 mb-1 font-mono">
                      {edu.degree}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">{edu.period}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications with Credential Links */}
            <div>
              <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
                <Award size={15} />
                Certifications
              </h3>
              <div className="space-y-3">
                {RESUME_DATA.certifications.map((cert, idx) => (
                  <div key={idx} className="card p-4 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-cyan-500/10 border border-cyan-500/25 text-cyan-400">
                        <Award size={18} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">{cert.name}</h4>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">
                          {cert.issuer} · {cert.date}
                        </p>
                      </div>
                    </div>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary py-1 px-2.5 text-xs text-cyan-300 border-cyan-500/30 flex items-center gap-1 flex-shrink-0"
                      >
                        Verify <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Badges & TryHackMe Telemetry */}
        <div className="mt-12 pt-8 border-t border-cyan-500/15">
          <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider font-mono mb-6">
            Badges &amp; Public Profiles
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {TROPHIES.map((trophy, idx) => {
              const inner = (
                <div className="card text-center group cursor-pointer h-full flex flex-col items-center justify-center py-5">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold font-mono mb-2 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 group-hover:scale-110 group-hover:border-cyan-400 transition-all">
                    {trophy.icon === 'GDSC' ? <Globe size={18} /> : trophy.icon === 'GCP' ? <Cloud size={18} /> : trophy.icon}
                  </div>
                  <h4 className="font-semibold text-white text-xs mb-1">{trophy.title}</h4>
                  <p className="text-[11px] text-gray-500">{trophy.issuer}</p>
                </div>
              );

              return trophy.link ? (
                <a key={idx} href={trophy.link} target="_blank" rel="noreferrer">{inner}</a>
              ) : (
                <div key={idx}>{inner}</div>
              );
            })}
          </div>

          {/* TryHackMe Live Telemetry Card with dark-themed wrapper */}
          <div className="card border-cyan-500/25 p-5 flex flex-col items-center bg-[#0a0e1a]">
            <div className="flex items-center justify-between w-full max-w-xl mb-3">
              <span className="text-xs font-mono text-gray-400 uppercase">TRYHACKME LIVE PROFILE</span>
              <a
                href={USER_CONFIG.thmProfile}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                ArtemizZ (Top 30%) <ExternalLink size={12} />
              </a>
            </div>
            <div className="w-[340px] max-w-full h-[88px] rounded-lg overflow-hidden border border-cyan-500/30 bg-[#0e1424] flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.1)]">
              <iframe
                src={`https://tryhackme.com/api/v2/badges/public-profile?userPublicId=${USER_CONFIG.thmUserPublicId}`}
                style={{ border: 'none', background: '#0e1424', colorScheme: 'dark' }}
                className="w-[340px] h-[88px] overflow-hidden rounded-lg"
                title="TryHackMe Stats"
                scrolling="no"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </Section>

      {/* =========================================================
          EXPERIENCE SECTION — Highlighting IIT Madras ASTRA Lab
          ========================================================= */}
      <Section id="experience" className="relative z-10 border-t border-cyan-500/10">
        <div className="section-divider"></div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="section-title">Research & Experience</h2>
            <p className="section-subtitle">
              Adversary emulation, C2 infrastructure, and offensive security research engagements
            </p>
          </div>
          <span className="font-mono text-xs px-3 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 self-start sm:self-auto">
            CURRENT: ACTIVE RESEARCH
          </span>
        </div>

        <div className="space-y-6">
          {RESUME_DATA.experience.map((exp, idx) => (
            <div key={idx} className="card cyber-card-bracket border-cyan-500/30 bg-gradient-to-b from-[#0e1424] to-[#0a0e19]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-4 border-b border-cyan-500/15">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/15 px-2.5 py-0.5 font-mono text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      ACTIVE INTERNSHIP
                    </span>
                    <span className="tag text-xs">
                      {exp.location}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                    {exp.role}
                  </h3>
                  <p className="text-base sm:text-lg font-medium text-cyan-400 font-heading">
                    {exp.organization}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <span className="font-mono text-xs sm:text-sm text-cyan-300 font-semibold px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 inline-block">
                    {exp.period}
                  </span>
                  {exp.mentors && (
                    <p className="text-xs text-gray-400 font-mono mt-1">
                      Advisors: {exp.mentors}
                    </p>
                  )}
                </div>
              </div>

              {/* Research Details */}
              <div className="space-y-3 mb-5">
                {exp.details.map((detail, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-2.5 text-sm sm:text-base text-gray-300 leading-relaxed">
                    <ChevronRight size={16} className="text-cyan-400 flex-shrink-0 mt-1" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>

              {/* TTP Tags */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-cyan-500/10">
                {exp.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="tag text-xs font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* =========================================================
          SELECTED PROJECTS — Red Team Tools & Frameworks
          ========================================================= */}
      <Section id="projects" className="relative z-10 border-t border-cyan-500/10">
        <div className="section-divider"></div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="section-title">Selected Projects</h2>
            <p className="section-subtitle">
              Adversary simulation frameworks, enterprise attack labs, and automated tooling
            </p>
          </div>
          <span className="font-mono text-xs text-gray-400 self-start sm:self-auto">
            TOTAL REPOSITORIES: {RESUME_DATA.projects.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {RESUME_DATA.projects.map((project, idx) => {
            const isExpanded = !!expandedProjects[idx];
            return (
              <div key={idx} className="card card-project group flex flex-col justify-between">
                <div>
                  {/* Top Bar: Status Badge & Links */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`tag text-[11px] font-mono ${
                        project.badge === 'v1.0 Release'
                          ? '!bg-cyan-500/15 !text-cyan-300 !border-cyan-500/40'
                          : project.badge === 'Conference Track 2026'
                          ? '!bg-purple-500/15 !text-purple-300 !border-purple-500/40'
                          : '!bg-emerald-500/15 !text-emerald-300 !border-emerald-500/40'
                      }`}>
                        {project.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {project.releaseLink && (
                        <a
                          href={project.releaseLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded flex items-center gap-1 transition-all"
                          title="View v1.0 Release"
                        >
                          <Award size={12} />
                          v1.0
                        </a>
                      )}
                      {project.liveLink && (
                        <a
                          href={project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-emerald-400 transition-colors p-1"
                          title="Live Demo"
                        >
                          <Globe size={16} />
                        </a>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-cyan-400 transition-colors p-1"
                          title="Source Code"
                        >
                          <ArrowUpRight size={17} />
                        </a>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold font-heading text-white group-hover:text-cyan-400 transition-colors mb-1">
                    {project.title}
                  </h3>

                  <p className="text-xs text-gray-500 font-mono mb-3">{project.period}</p>

                  {/* MITRE ATT&CK Tactic */}
                  {project.mitreTactic && (
                    <div className="mb-3">
                      <span className="tag-mitre text-[11px] font-mono px-2 py-0.5 rounded inline-flex items-center gap-1">
                        <Shield size={11} />
                        {project.mitreTactic}
                      </span>
                    </div>
                  )}

                  {/* Tech stack tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech.split(', ').map((tech, tIdx) => (
                      <span key={tIdx} className="tag text-[11px]">{tech}</span>
                    ))}
                  </div>

                  {/* Details */}
                  <ul className="space-y-2 mb-4">
                    {project.details.slice(0, isExpanded ? undefined : 2).map((detail, dIdx) => (
                      <li key={dIdx} className="text-sm text-gray-300 leading-relaxed flex items-start">
                        <ChevronRight size={14} className="mr-2 mt-1 flex-shrink-0 text-cyan-400/70" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {project.details.length > 2 && (
                  <button
                    onClick={() => toggleProjectExpand(idx)}
                    className="text-xs font-mono text-cyan-400/80 hover:text-cyan-300 flex items-center gap-1 mt-2 pt-2 border-t border-cyan-500/10"
                  >
                    {isExpanded ? (
                      <>Show Less <ChevronUp size={13} /></>
                    ) : (
                      <>Read Full Specifications <ChevronDown size={13} /></>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* =========================================================
          TALKS & WORKSHOPS SECTION
          ========================================================= */}
      {RESUME_DATA.talks && RESUME_DATA.talks.length > 0 && (
        <Section id="talks" className="relative z-10 border-t border-cyan-500/10">
          <div className="section-divider"></div>
          <h2 className="section-title">Talks & Workshops</h2>
          <p className="section-subtitle mb-8">
            Technical briefings, adversarial tradecraft workshops, and community sessions
          </p>

          <div className="space-y-4">
            {RESUME_DATA.talks.map((talk, idx) => (
              <div key={idx} className="card border-cyan-500/20 bg-[#0c101d]">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                      <Mic size={18} />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold font-heading text-white">
                        {talk.title}
                      </h3>
                      <p className="text-sm text-cyan-400 font-mono">
                        {talk.event}
                      </p>
                    </div>
                  </div>
                  <span className="tag text-xs font-mono self-start sm:self-auto">
                    {talk.period}
                  </span>
                </div>

                <div className="space-y-2 mb-4 pl-0 sm:pl-13">
                  {talk.details.map((d, dIdx) => (
                    <p key={dIdx} className="text-sm text-gray-300 leading-relaxed">
                      {d}
                    </p>
                  ))}
                  <p className="text-xs text-gray-400 font-mono">
                    Audience: <span className="text-gray-300">{talk.audience}</span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-3 border-t border-cyan-500/10 sm:ml-13">
                  {talk.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="tag text-xs font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* =========================================================
          RESEARCH & PUBLICATIONS SECTION
          ========================================================= */}
      {RESUME_DATA.publications && RESUME_DATA.publications.length > 0 && (
        <Section id="research" className="relative z-10 border-t border-cyan-500/10">
          <div className="section-divider"></div>
          <h2 className="section-title">Research & Publications</h2>
          <p className="section-subtitle mb-8">
            Peer-reviewed scientific publications and academic conference proceedings
          </p>

          <div className="space-y-6">
            {RESUME_DATA.publications.map((pub, idx) => (
              <div key={idx} className="card border-blue-500/30 bg-[#0c1222]">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-500/15 border border-blue-500/30 text-blue-400">
                    <BookOpen size={18} />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-400">
                        <CheckCircle2 size={12} />
                        {pub.status}
                      </span>
                      {pub.role && (
                        <span className="tag text-xs">
                          {pub.role}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold font-heading text-white">
                      {pub.title}
                    </h3>
                    <p className="text-sm text-cyan-400/90 font-mono">
                      {pub.publisher}
                    </p>
                    <ul className="space-y-1 pt-1">
                      {pub.details.map((d, i) => (
                        <li key={i} className="text-sm text-gray-300 leading-relaxed">{d}</li>
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
          BLOG / WRITEUPS SECTION
          ========================================================= */}
      <Section id="blog" className="relative z-10 border-t border-cyan-500/10">
        <div className="section-divider"></div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <h2 className="section-title">Writeups & Research Notes</h2>
            <p className="section-subtitle">
              CTF walkthroughs, active directory exploitation techniques, and red team methodology
            </p>
          </div>

          {/* Search bar */}
          <div className="relative md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/60" />
            <input
              type="text"
              placeholder="Search writeups or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-10 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="space-y-4">
            {filteredPosts.slice(0, visiblePostsCount).map(post => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="card p-5 cursor-pointer group hover:border-cyan-500/40 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold font-heading text-white group-hover:text-cyan-400 transition-colors text-base sm:text-lg mb-1 truncate">
                      {post.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-mono">
                      <span>{post.date}</span>
                      <span>·</span>
                      <span className="text-cyan-300">{post.category}</span>
                      <span>·</span>
                      <span>{post.readTime} read</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`tag text-xs ${
                      post.difficulty === 'Hard' || post.difficulty === 'Critical'
                        ? '!bg-red-500/10 !text-red-400 !border-red-500/20'
                        : post.difficulty === 'Medium'
                        ? '!bg-amber-500/10 !text-amber-400 !border-amber-500/20'
                        : '!bg-emerald-500/10 !text-emerald-400 !border-emerald-500/20'
                    }`}>
                      {post.difficulty}
                    </span>
                    <ArrowRight size={16} className="text-cyan-400 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}

            {filteredPosts.length > visiblePostsCount && (
              <div className="text-center pt-6">
                <button
                  onClick={() => setVisiblePostsCount(prev => prev + 5)}
                  className="btn-secondary"
                >
                  Show More Writeups
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <FileText size={40} className="mx-auto mb-4 opacity-40 text-cyan-400" />
            <p className="font-mono text-sm">
              {searchQuery ? `No writeups found for "${searchQuery}"` : 'No writeups published yet'}
            </p>
          </div>
        )}
      </Section>

      {/* =========================================================
          CONTACT SECTION
          ========================================================= */}
      <Section id="contact" className="relative z-10 border-t border-cyan-500/10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="section-divider mx-auto"></div>
          <h2 className="section-title">Initiate Contact</h2>
          <p className="section-subtitle mx-auto mb-8">
            Interested in adversary simulation, security tooling collaboration, or offensive security roles? Let's talk.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
            <div className="card p-4">
              <div className="text-xs font-mono text-gray-500 uppercase mb-1 flex items-center gap-1.5">
                <Mail size={13} className="text-cyan-400" /> EMAIL
              </div>
              <a href={`mailto:${USER_CONFIG.email}`} className="text-xs sm:text-sm font-mono text-cyan-300 hover:underline break-all">
                {USER_CONFIG.email}
              </a>
            </div>

            <div className="card p-4">
              <div className="text-xs font-mono text-gray-500 uppercase mb-1 flex items-center gap-1.5">
                <Phone size={13} className="text-cyan-400" /> TELEPHONE
              </div>
              <a href="tel:+917012705946" className="text-xs sm:text-sm font-mono text-cyan-300 hover:underline">
                +91 7012705946
              </a>
            </div>

            <div className="card p-4">
              <div className="text-xs font-mono text-gray-500 uppercase mb-1 flex items-center gap-1.5">
                <MapPin size={13} className="text-cyan-400" /> LOCATIONS
              </div>
              <div className="text-xs sm:text-sm font-mono text-gray-300">
                Chennai / Kozhikode
              </div>
            </div>
          </div>

          <form
            className="text-left space-y-4 card p-6 border-cyan-500/30"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const sender = formData.get('sender');
              const email = formData.get('email');
              const message = formData.get('message');
              window.location.href = `mailto:${USER_CONFIG.email}?subject=OffSec Contact from ${sender}&body=${message}%0D%0A%0D%0A--------------------------------%0D%0ASender Details:%0D%0AName: ${sender}%0D%0AEmail: ${email}`;
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">Your Name</label>
                <input name="sender" required type="text" className="form-input" placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">Your Email</label>
                <input name="email" required type="email" className="form-input" placeholder="e.g. name@company.com" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">Message Content</label>
              <textarea name="message" required rows={4} className="form-input resize-none" placeholder="Details regarding project, opportunity, or research collaboration..."></textarea>
            </div>
            <button type="submit" className="btn-primary w-full justify-center">
              <Send size={16} />
              Transmit Encrypted Dispatch
            </button>
          </form>
        </div>
      </Section>

      {/* =========================================================
          FOOTER
          ========================================================= */}
      <footer className="border-t border-cyan-500/15 py-10 relative z-10 bg-[#06070b]/90 pb-24 md:pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-xs sm:text-sm font-mono text-gray-400">
              © {new Date().getFullYear()} {USER_CONFIG.username}. Offensive Security Research & Adversary Simulation.
            </p>
            <p className="text-[11px] font-mono text-gray-600 mt-0.5">
              Cipher: AES-256-GCM // Node: ASTRA-LAB IIT Madras // Protocol: HTTPS
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a href={USER_CONFIG.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors" aria-label="GitHub">
              <Github size={18} />
            </a>
            <a href={USER_CONFIG.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href={USER_CONFIG.googleDev} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors" aria-label="Google Dev">
              <Braces size={18} />
            </a>
            <a href={USER_CONFIG.instagram} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors" aria-label="Instagram">
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
