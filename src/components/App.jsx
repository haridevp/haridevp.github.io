import React, { useState, useEffect } from 'react';
import {
  ArrowRight, ExternalLink, Globe, Download, Github, Linkedin,
  Mail, Instagram, Braces, FileText, Award, BookOpen, ChevronRight,
  ArrowUpRight, Clock, Hash, Lock, Search, X, Cloud
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

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + " years ago";
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + " months ago";
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + " days ago";
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + " hours ago";
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
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
          setLastCommit("No recent commits");
        }
      } catch (error) {
        setLastCommit("Offline");
      }
    };
    fetchLastCommit();

    // Discord webhook notification
    const notifyVisit = async () => {
      const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
      if (!webhookUrl || sessionStorage.getItem('notified')) return;

      try {
        let ipv4 = "Unknown", ipv6 = "Not Detected", location = "Unknown", isp = "Unknown";
        try {
          const v4Res = await fetch('https://api.ipify.org?format=json');
          ipv4 = (await v4Res.json()).ip;
        } catch (e) {}
        try {
          const v6Res = await fetch('https://api6.ipify.org?format=json');
          ipv6 = (await v6Res.json()).ip;
        } catch (e) {}
        try {
          const locRes = await fetch('https://ipapi.co/json/');
          const locData = await locRes.json();
          if (!locData.error) {
            location = `${locData.city}, ${locData.country_code}`;
            isp = locData.org;
          }
        } catch (e) {}

        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `🚨 **Incoming Connection Detected**\n**IPv4:** ${ipv4}\n**IPv6:** ${ipv6}\n**Location:** ${location}\n**ISP:** ${isp}\n**User Agent:** ${navigator.userAgent}`
          })
        });
        sessionStorage.setItem('notified', 'true');
      } catch (err) {}
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
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <Navbar />
        <div className="pt-24 pb-20 max-w-3xl mx-auto px-6">
          <button
            onClick={() => setSelectedPost(null)}
            className="btn-secondary mb-8 text-sm"
          >
            ← Back to Blog
          </button>

          <div className="mb-8">
            <div className="flex flex-wrap gap-3 mb-4">
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
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
              {selectedPost.title}
            </h1>
            <p className="text-sm text-gray-500 font-mono">{selectedPost.date}</p>
          </div>

          <div className="markdown-body">
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
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      {/* ===== HERO ===== */}
      <div className="hero-gradient pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="animate-fade-in-up">
            <div className="status-badge mb-6">
              <span className="status-dot"></span>
              Open to Work
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight animate-fade-in-up delay-100">
            {USER_CONFIG.username}
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-6 animate-fade-in-up delay-200">
            {USER_CONFIG.role}
          </p>

          <p className="text-gray-500 max-w-xl leading-relaxed mb-10 animate-fade-in-up delay-300">
            Specializing in Web Application Security, Network Penetration Testing, and Red Team Operations.
            Building tools to automate the offensive and defend the unknown.
          </p>

          <div className="flex flex-wrap gap-4 mb-12 animate-fade-in-up delay-400">
            <a href="#projects" className="btn-primary">
              View Projects <ArrowRight size={16} />
            </a>
            <a href="#blog" className="btn-secondary">
              Read Writeups
            </a>
            <a
              href="https://drive.google.com/file/d/11Z8Hjht9I_tXcc01UM-g3IXBK8JEX5lM/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <Download size={16} />
              Resume
            </a>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-6 text-sm animate-fade-in-up delay-500">
            <div className="flex items-center gap-2 text-gray-500">
              <span className="font-mono text-gray-400">{BLOG_POSTS.length}</span> Writeups Published
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              Last commit: <span className="font-mono text-gray-400">{lastCommit}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== ABOUT / EDUCATION ===== */}
      <Section id="about">
        <div className="section-divider"></div>
        <h2 className="section-title">About</h2>
        <p className="section-subtitle mb-12">Education & Certifications</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Education */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Education</h3>
            <div className="space-y-6">
              {RESUME_DATA.education?.map((edu, idx) => (
                <div key={idx} className="card">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white text-base">{edu.institution}</h4>
                  </div>
                  <p style={{ color: 'var(--accent)' }} className="text-sm font-medium mb-1">{edu.degree}</p>
                  <p className="text-xs text-gray-500 font-mono">{edu.period}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Certifications</h3>
            <div className="space-y-4">
              {RESUME_DATA.certifications?.map((cert, idx) => (
                <div key={idx} className="card">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-subtle)', border: '1px solid rgba(79, 209, 197, 0.15)' }}>
                      <Award size={18} style={{ color: 'var(--accent)' }} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">{cert.name}</h4>
                      <p className="text-xs text-gray-500">{cert.issuer} · {cert.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Skills */}
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6 mt-10">Skills</h3>
            <div className="space-y-5">
              {RESUME_DATA.skills?.map((group, idx) => (
                <div key={idx}>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{group.category}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill, sIdx) => (
                      <span key={sIdx} className="tag tag-neutral text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== ACHIEVEMENTS & STATS ===== */}
        <div className="mt-16 pt-8 border-t border-[var(--border-subtle)]">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Achievements & Badges</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TROPHIES.map((trophy, idx) => {
              const inner = (
                <div className="card text-center group cursor-pointer h-full flex flex-col items-center justify-center py-6">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold font-mono mb-3 transition-all duration-300 group-hover:scale-110"
                    style={{ background: 'var(--accent-subtle)', color: 'var(--accent)', border: '1px solid rgba(79, 209, 197, 0.15)' }}
                  >
                    {trophy.icon === 'GDSC' ? <Globe size={20} /> : trophy.icon === 'GCP' ? <Cloud size={20} /> : trophy.icon}
                  </div>
                  <h4 className="font-semibold text-white text-sm mb-1">{trophy.title}</h4>
                  <p className="text-xs text-gray-500">{trophy.issuer}</p>
                </div>
              );

              return trophy.link ? (
                <a key={idx} href={trophy.link} target="_blank" rel="noreferrer">{inner}</a>
              ) : (
                <div key={idx}>{inner}</div>
              );
            })}
          </div>

          {/* TryHackMe Stats */}
          <div className="mt-8 card flex flex-col items-center">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">TryHackMe Stats</h4>
            <iframe
              src={`https://tryhackme.com/api/v2/badges/public-profile?userPublicId=${USER_CONFIG.thmUserPublicId}`}
              style={{ border: 'none' }}
              className="w-full max-w-lg h-52 overflow-hidden"
              title="TryHackMe Stats"
              scrolling="no"
            ></iframe>
          </div>
        </div>
      </Section>

      {/* ===== PROJECTS ===== */}
      <Section id="projects">
        <div className="section-divider"></div>
        <h2 className="section-title">Selected Projects</h2>
        <p className="section-subtitle mb-12">Research tools and security frameworks I've built</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {RESUME_DATA.projects?.map((project, idx) => (
            <div key={idx} className="card card-project group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[var(--accent)] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">{project.period}</p>
                </div>
                <div className="flex items-center gap-2">
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-emerald-400 transition-colors p-1"
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
                      className="text-gray-500 hover:text-white transition-colors p-1"
                      title="Source Code"
                    >
                      <ArrowUpRight size={16} />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.split(', ').map((tech, tIdx) => (
                  <span key={tIdx} className="tag text-xs">{tech}</span>
                ))}
              </div>

              <ul className="space-y-2">
                {project.details.map((detail, dIdx) => (
                  <li key={dIdx} className="text-sm text-gray-400 leading-relaxed flex">
                    <ChevronRight size={14} className="mr-2 mt-1 flex-shrink-0 text-gray-600" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== RESEARCH & PUBLICATIONS ===== */}
      {RESUME_DATA.publications && RESUME_DATA.publications.length > 0 && (
        <Section id="research">
          <div className="section-divider"></div>
          <h2 className="section-title">Research & Publications</h2>
          <p className="section-subtitle mb-12">Academic contributions and ongoing research</p>

          <div className="space-y-6">
            {RESUME_DATA.publications.map((pub, idx) => (
              <div key={idx} className="card">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(96, 165, 250, 0.08)', border: '1px solid rgba(96, 165, 250, 0.15)' }}>
                    <BookOpen size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">{pub.title}</h3>
                    <p className="text-sm text-gray-400 mb-3 font-mono">{pub.publisher}</p>
                    <ul className="space-y-1">
                      {pub.details.map((d, i) => (
                        <li key={i} className="text-sm text-gray-500 leading-relaxed">{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}


      {/* ===== BLOG / WRITEUPS ===== */}
      <Section id="blog">
        <div className="section-divider"></div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <h2 className="section-title">Blog & Writeups</h2>
            <p className="section-subtitle">CTF writeups, security research, and technical notes</p>
          </div>

          {/* Search */}
          <div className="relative mt-6 md:mt-0 md:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search writeups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-10 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
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
                className="blog-card p-5 cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white group-hover:text-[var(--accent)] transition-colors mb-1 truncate">
                      {post.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span>{post.date}</span>
                      <span>·</span>
                      <span>{post.category}</span>
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
                    <ArrowRight size={16} className="text-gray-600 group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" />
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
          <div className="text-center py-16 text-gray-600">
            <FileText size={40} className="mx-auto mb-4 opacity-40" />
            <p className="font-mono text-sm">
              {searchQuery ? `No results for "${searchQuery}"` : 'No writeups yet'}
            </p>
          </div>
        )}
      </Section>

      {/* ===== CONTACT ===== */}
      <Section id="contact">
        <div className="max-w-2xl mx-auto text-center">
          <div className="section-divider mx-auto"></div>
          <h2 className="section-title">Get in Touch</h2>
          <p className="section-subtitle mx-auto mb-10">
            Interested in collaborating on security research, or have an opportunity to discuss? Let's connect.
          </p>

          <form
            className="text-left space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const sender = formData.get('sender');
              const email = formData.get('email');
              const message = formData.get('message');
              window.location.href = `mailto:${USER_CONFIG.email}?subject=Portfolio Contact from ${sender}&body=${message}%0D%0A%0D%0A--------------------------------%0D%0ASender Details:%0D%0AName: ${sender}%0D%0AEmail: ${email}`;
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                <input name="sender" required type="text" className="form-input" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input name="email" required type="email" className="form-input" placeholder="your@email.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
              <textarea name="message" required rows={5} className="form-input resize-none" placeholder="What's on your mind?"></textarea>
            </div>
            <button type="submit" className="btn-primary w-full justify-center">
              <Mail size={16} />
              Send Message
            </button>
          </form>
        </div>
      </Section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t py-10" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} {USER_CONFIG.username}. Built with React.
          </p>
          <div className="flex items-center gap-4">
            <a href={USER_CONFIG.github} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-white transition-colors">
              <Github size={18} />
            </a>
            <a href={USER_CONFIG.linkedin} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-white transition-colors">
              <Linkedin size={18} />
            </a>
            <a href={USER_CONFIG.googleDev} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-white transition-colors">
              <Braces size={18} />
            </a>
            <a href={USER_CONFIG.instagram} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-white transition-colors">
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
