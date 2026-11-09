import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  BookOpen, Search, X, ArrowUpRight, ChevronRight,
  Clock, Calendar, Tag, Shield, Terminal, FileText, Check, ExternalLink
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
import { BLOG_POSTS } from '../data/blog';
import { USER_CONFIG } from '../data/config';

// Curated subtopic tagging based on content analysis
const getTrackForPost = (post) => {
  const t = (post.title + ' ' + post.content).toLowerCase();
  if (t.includes('registry') || t.includes('forensics') || t.includes('windows') || t.includes('obfuscation')) {
    return 'Windows & Forensics';
  }
  if (t.includes('sqli') || t.includes('race condition') || t.includes('http') || t.includes('web') || t.includes('phishing')) {
    return 'Web & Threat Analysis';
  }
  if (t.includes('splunk') || t.includes('log') || t.includes('linux') || t.includes('bash')) {
    return 'Systems & SIEM';
  }
  if (t.includes('scada') || t.includes('plc') || t.includes('aws') || t.includes('cloud')) {
    return 'Cloud & ICS';
  }
  return 'Hands-on CTF';
};

const TRACK_FILTERS = [
  'All Writeups',
  'Windows & Forensics',
  'Web & Threat Analysis',
  'Systems & SIEM',
  'Cloud & ICS'
];

export default function WriteupsBrowser() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTrack, setActiveTrack] = useState('All Writeups');
  const [selectedPost, setSelectedPost] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const dialogRef = useRef(null);

  // Manage native <dialog> state
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (selectedPost) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [selectedPost]);

  const enrichedPosts = useMemo(() => {
    return BLOG_POSTS.map(post => ({
      ...post,
      track: getTrackForPost(post)
    }));
  }, []);

  const filteredPosts = useMemo(() => {
    return enrichedPosts.filter(post => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.track.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTrack =
        activeTrack === 'All Writeups' || post.track === activeTrack;

      return matchesSearch && matchesTrack;
    });
  }, [enrichedPosts, searchQuery, activeTrack]);

  const handleCloseDialog = () => {
    setSelectedPost(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Search & Track Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Track Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {TRACK_FILTERS.map(track => (
            <button
              key={track}
              type="button"
              onClick={() => {
                setActiveTrack(track);
                setVisibleCount(6);
              }}
              className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeTrack === track
                  ? 'bg-sky-500/15 border-sky-400/40 text-sky-200 font-medium'
                  : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05]'
              }`}
            >
              {track} {track === 'All Writeups' && `(${BLOG_POSTS.length})`}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative md:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search writeups by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input text-xs pl-8 pr-7 py-2 rounded-lg"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Writeup Cards Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredPosts.slice(0, visibleCount).map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="card p-4 sm:p-5 cursor-pointer group hover:border-zinc-500 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5 text-[11px] font-mono text-zinc-500">
                  <span className="tag text-[10px] text-sky-400 border-sky-500/20 bg-sky-500/5">
                    {post.track}
                  </span>
                  <span>{post.readTime}</span>
                </div>

                <h4 className="font-semibold text-white group-hover:text-sky-300 transition-colors text-sm sm:text-base mb-2 line-clamp-2 leading-snug">
                  {post.title}
                </h4>

                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {post.content.replace(/#+.*?\n/g, '').replace(/\[.*?\]\(.*?\)/g, '').slice(0, 140)}...
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-500 group-hover:text-zinc-300">
                <span>{post.date}</span>
                <span className="text-sky-400/90 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Read Article</span>
                  <ChevronRight size={13} />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-zinc-500 border border-dashed border-white/10 rounded-xl">
          <FileText size={28} className="mx-auto mb-2 opacity-40" />
          <p className="text-xs font-mono">
            No writeups match your current filter or query "{searchQuery}".
          </p>
        </div>
      )}

      {/* Pagination Button */}
      {filteredPosts.length > visibleCount && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setVisibleCount(prev => prev + 6)}
            className="btn-secondary text-xs"
          >
            Load Next 6 Writeups ({filteredPosts.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {/* Native Modal Dialog for Article Reading (Accessible & Contained) */}
      <dialog
        ref={dialogRef}
        onCancel={handleCloseDialog}
        aria-labelledby="writeup-dialog-title"
        className="w-[94vw] max-w-4xl p-0 rounded-2xl bg-slate-950 text-zinc-100 border border-white/15 shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-sm fixed inset-0 m-auto max-h-[90vh] overflow-y-auto overscroll-contain"
      >
        {selectedPost && (
          <div className="p-6 sm:p-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-white/[0.08] sticky top-0 bg-slate-950/90 backdrop-blur-md z-30 pt-1">
              <div className="flex items-center gap-2">
                <span className="tag text-xs font-mono text-sky-400">
                  {selectedPost.track}
                </span>
                <span className="text-xs font-mono text-zinc-500">
                  {selectedPost.readTime} · {selectedPost.date}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={USER_CONFIG.gitbook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gitbook text-xs py-1.5 px-3 flex items-center gap-1"
                >
                  <BookOpen size={13} />
                  <span className="hidden sm:inline">View on GitBook</span>
                  <ExternalLink size={12} />
                </a>

                <button
                  type="button"
                  onClick={handleCloseDialog}
                  className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-colors"
                  aria-label="Close article"
                  autoFocus
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Title */}
            <h2 id="writeup-dialog-title" className="text-2xl sm:text-3xl font-bold text-white mb-6 tracking-tight leading-snug">
              {selectedPost.title}
            </h2>

            {/* Markdown Body */}
            <div className="markdown-body bg-zinc-950/60 p-5 sm:p-7 rounded-xl border border-white/[0.08]">
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

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>Author: {USER_CONFIG.username} (ASTRA Lab, IIT Madras)</span>
              <button
                type="button"
                onClick={handleCloseDialog}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
