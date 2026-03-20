import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkAlert } from 'remark-github-blockquote-alert';
import { Lock, Upload, Eye, EyeOff, FileText, Send, ArrowLeft, CheckCircle, AlertTriangle, LogIn, Trash2, RefreshCw } from 'lucide-react';
import CodeBlock from './CodeBlock';
import WindowFrame from './WindowFrame';

const ADMIN_USER = import.meta.env.VITE_ADMIN_USER;
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS;

export default function AdminPage({ onBack }) {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('CTF');
  const [difficulty, setDifficulty] = useState('Medium');
  const [readTime, setReadTime] = useState('5 min');
  const [markdownContent, setMarkdownContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null); // { success, message }

  // Post manager state
  const [existingPosts, setExistingPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [deletingFile, setDeletingFile] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fileInputRef = useRef(null);

  // Fetch existing posts
  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch('/api/list-posts');
      const data = await res.json();
      setExistingPosts(data.files || []);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    }
    setLoadingPosts(false);
  };

  // Delete a post
  const handleDelete = async (filename) => {
    setDeletingFile(filename);
    try {
      const res = await fetch('/api/delete-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitResult({ success: true, message: `Deleted: ${filename}` });
        fetchPosts();
      } else {
        setSubmitResult({ success: false, message: data.error || 'Delete failed.' });
      }
    } catch (err) {
      setSubmitResult({ success: false, message: `Delete error: ${err.message}` });
    }
    setDeletingFile(null);
    setConfirmDelete(null);
  };

  // Load posts when authenticated
  useEffect(() => {
    if (isAuthenticated || sessionStorage.getItem('admin_auth') === 'true') {
      fetchPosts();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!ADMIN_USER || !ADMIN_PASS) {
      setLoginError('Admin credentials not configured. Set VITE_ADMIN_USER and VITE_ADMIN_PASS in .env');
      return;
    }
    if (loginUser === ADMIN_USER && loginPass === ADMIN_PASS) {
      setIsAuthenticated(true);
      setLoginError('');
      sessionStorage.setItem('admin_auth', 'true');
    } else {
      setLoginError('Authentication failed. Invalid credentials.');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      
      // Try to parse frontmatter from uploaded file
      const fmPattern = /^---[\r\n]+([\s\S]*?)[\r\n]+---[\r\n]+([\s\S]*)$/;
      const match = content.match(fmPattern);
      
      if (match) {
        const yamlBlock = match[1];
        const body = match[2].trim();
        
        // Parse frontmatter fields
        yamlBlock.split(/[\r\n]+/).forEach(line => {
          const colonIndex = line.indexOf(':');
          if (colonIndex !== -1) {
            const key = line.slice(0, colonIndex).trim();
            const value = line.slice(colonIndex + 1).trim();
            if (key === 'title') setTitle(value);
            if (key === 'date') setDate(value);
            if (key === 'category') setCategory(value);
            if (key === 'difficulty') setDifficulty(value);
            if (key === 'readTime') setReadTime(value);
          }
        });
        
        setMarkdownContent(body);
      } else {
        // No frontmatter — just set content
        setMarkdownContent(content);
        if (!title && file.name) {
          setTitle(file.name.replace('.md', '').replace(/[-_]/g, ' '));
        }
      }
    };
    reader.readAsText(file);
  };

  const generateFrontmatter = () => {
    // Auto-generate an ID from existing posts count + 1
    const nextId = Date.now();
    return `---
id: ${nextId}
title: ${title}
date: ${date}
category: ${category}
difficulty: ${difficulty}
readTime: ${readTime}
---

${markdownContent}`;
  };

  const handleSubmit = async () => {
    if (!title.trim() || !markdownContent.trim()) {
      setSubmitResult({ success: false, message: 'Title and content are required.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    const fullContent = generateFrontmatter();
    const filename = `${title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, ' ').trim()}.md`;

    try {
      const res = await fetch('/api/save-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, content: fullContent }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitResult({ success: true, message: `Writeup saved! File: ${filename}. The blog will auto-update via HMR.` });
        fetchPosts(); // Refresh the list
        // Reset form
        setTitle('');
        setMarkdownContent('');
        setDate(new Date().toISOString().split('T')[0]);
        setCategory('CTF');
        setDifficulty('Medium');
        setReadTime('5 min');
      } else {
        setSubmitResult({ success: false, message: data.error || 'Failed to save writeup.' });
      }
    } catch (err) {
      setSubmitResult({ success: false, message: `Network error: ${err.message}. Is the dev server running?` });
    }

    setIsSubmitting(false);
  };

  // ==================== LOGIN SCREEN ====================
  if (!isAuthenticated && sessionStorage.getItem('admin_auth') !== 'true') {
    return (
      <WindowFrame title="auth_gateway.sys" active={true} onClose={onBack}>
        <div className="min-h-full flex items-center justify-center pb-20 md:pb-0">
          <div className="w-full max-w-md">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 backdrop-blur-sm shadow-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border-2 border-red-500/50 flex items-center justify-center">
                  <Lock className="text-red-400" size={28} />
                </div>
                <h2 className="text-xl font-bold text-white font-mono tracking-wider">RESTRICTED_ACCESS</h2>
                <p className="text-xs text-slate-500 font-mono mt-2">Authorization required to continue</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-cyan-400 text-xs font-mono mb-1.5">{'>'} OPERATOR_ID</label>
                  <input
                    type="text"
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-3 rounded font-mono text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    placeholder="Enter username"
                    autoFocus
                  />
                </div>

                <div className="relative">
                  <label className="block text-cyan-400 text-xs font-mono mb-1.5">{'>'} ACCESS_KEY</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-3 pr-10 rounded font-mono text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-8 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {loginError && (
                  <div className="flex items-center space-x-2 text-red-400 text-xs font-mono bg-red-500/10 border border-red-500/30 rounded p-3">
                    <AlertTriangle size={14} />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-cyan-900/30 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-black font-bold font-mono tracking-wider transition-all uppercase flex justify-center items-center group rounded"
                >
                  <LogIn className="mr-2 group-hover:translate-x-1 transition-transform" size={16} />
                  AUTHENTICATE
                </button>
              </form>

              <div className="mt-6 text-center">
                <button onClick={onBack} className="text-xs text-slate-500 font-mono hover:text-slate-300 transition-colors">
                  ← RETURN_TO_DASHBOARD
                </button>
              </div>
            </div>
          </div>
        </div>
      </WindowFrame>
    );
  }

  // If session auth works, mark as authenticated
  if (!isAuthenticated && sessionStorage.getItem('admin_auth') === 'true') {
    setIsAuthenticated(true);
  }

  // ==================== ADMIN PANEL ====================
  return (
    <WindowFrame title="writeup_deployer.sh" active={true} onClose={onBack}>
      <div className="max-w-5xl mx-auto pb-20 md:pb-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-bold font-mono text-white">WRITEUP_DEPLOYER</h2>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
            <CheckCircle size={12} />
            <span>AUTHENTICATED</span>
          </div>
        </div>

        {/* Success/Error Banner */}
        {submitResult && (
          <div className={`mb-6 p-4 rounded border font-mono text-sm flex items-start space-x-2 ${
            submitResult.success 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`} style={{ animation: 'fadeInUp 0.3s ease-out' }}>
            {submitResult.success ? <CheckCircle size={16} className="mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="mt-0.5 shrink-0" />}
            <span>{submitResult.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Form */}
          <div className="space-y-4">
            {/* Metadata */}
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 space-y-3">
              <h3 className="text-cyan-400 font-mono text-sm mb-3 border-b border-slate-700 pb-2">POST_METADATA</h3>
              
              <div>
                <label className="block text-xs text-slate-400 font-mono mb-1">TITLE</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2.5 rounded font-mono text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  placeholder="e.g. Advent of Cyber 2025: Day 25"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 font-mono mb-1">DATE</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2.5 rounded font-mono text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-mono mb-1">CATEGORY</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2.5 rounded font-mono text-sm focus:border-cyan-500 focus:outline-none transition-all"
                  >
                    <option value="CTF">CTF</option>
                    <option value="HackTheBox">HackTheBox</option>
                    <option value="TryHackMe">TryHackMe</option>
                    <option value="Bug Bounty">Bug Bounty</option>
                    <option value="Malware">Malware</option>
                    <option value="Research">Research</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 font-mono mb-1">DIFFICULTY</label>
                  <select 
                    value={difficulty} 
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2.5 rounded font-mono text-sm focus:border-cyan-500 focus:outline-none transition-all"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-mono mb-1">READ_TIME</label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2.5 rounded font-mono text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    placeholder="e.g. 7 min"
                  />
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h3 className="text-cyan-400 font-mono text-sm mb-3 border-b border-slate-700 pb-2">IMPORT_FILE</h3>
              <div 
                className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:border-cyan-500/50 hover:bg-slate-800/30 transition-all group"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={28} className="mx-auto mb-2 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                <p className="text-sm text-slate-400 font-mono">Click to upload .md file</p>
                <p className="text-xs text-slate-600 mt-1">Frontmatter will be auto-parsed</p>
              </div>
              <input 
                ref={fileInputRef} 
                type="file" 
                accept=".md,.markdown,.txt"
                className="hidden" 
                onChange={handleFileUpload}
              />
            </div>

            {/* Markdown Editor */}
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3 border-b border-slate-700 pb-2">
                <h3 className="text-cyan-400 font-mono text-sm">CONTENT_EDITOR</h3>
                <span className="text-[10px] text-slate-500 font-mono">{markdownContent.length} chars</span>
              </div>
              <textarea
                value={markdownContent}
                onChange={(e) => setMarkdownContent(e.target.value)}
                rows={16}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-3 rounded font-mono text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all resize-y custom-scrollbar leading-relaxed"
                placeholder="Paste or type your markdown content here..."
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !title.trim() || !markdownContent.trim()}
              className="w-full py-3 bg-emerald-900/30 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500 hover:text-black font-bold font-mono tracking-wider transition-all uppercase flex justify-center items-center group rounded disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="animate-pulse">DEPLOYING_WRITEUP...</span>
              ) : (
                <>
                  <Send className="mr-2 group-hover:translate-x-1 transition-transform" size={16} />
                  DEPLOY_WRITEUP
                </>
              )}
            </button>

            {/* Existing Posts Manager */}
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3 border-b border-slate-700 pb-2">
                <h3 className="text-cyan-400 font-mono text-sm">EXISTING_POSTS</h3>
                <button
                  onClick={fetchPosts}
                  className="text-xs font-mono text-slate-400 hover:text-cyan-400 flex items-center space-x-1 transition-colors"
                >
                  <RefreshCw size={12} className={loadingPosts ? 'animate-spin' : ''} />
                  <span>REFRESH</span>
                </button>
              </div>

              {existingPosts.length === 0 ? (
                <p className="text-xs text-slate-600 font-mono text-center py-4">No posts found in src/posts/</p>
              ) : (
                <div className="space-y-1.5 max-h-64 overflow-auto custom-scrollbar">
                  {existingPosts.map((file) => (
                    <div
                      key={file}
                      className="flex items-center justify-between bg-slate-900/50 border border-slate-700/50 rounded px-3 py-2 group hover:border-slate-600 transition-all"
                    >
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <FileText size={14} className="text-slate-500 shrink-0" />
                        <span className="text-xs font-mono text-slate-300 truncate">{file}</span>
                      </div>

                      {confirmDelete === file ? (
                        <div className="flex items-center space-x-2 shrink-0 ml-2">
                          <button
                            onClick={() => handleDelete(file)}
                            disabled={deletingFile === file}
                            className="text-[10px] font-mono text-red-400 hover:text-red-300 border border-red-500/50 rounded px-2 py-0.5 hover:bg-red-500/20 transition-all"
                          >
                            {deletingFile === file ? '...' : 'CONFIRM'}
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="text-[10px] font-mono text-slate-500 hover:text-slate-300"
                          >
                            CANCEL
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(file)}
                          className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0 ml-2"
                          title={`Delete ${file}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Preview */}
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg overflow-hidden flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/80 border-b border-slate-700">
              <span className="text-xs font-mono text-slate-400">LIVE_PREVIEW</span>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
              >
                {showPreview ? <EyeOff size={12} /> : <Eye size={12} />}
                <span>{showPreview ? 'HIDE' : 'SHOW'}</span>
              </button>
            </div>
            <div className="flex-1 p-4 overflow-auto custom-scrollbar">
              {showPreview && markdownContent ? (
                <article className="markdown-body bg-transparent text-slate-300 font-sans leading-relaxed text-base">
                  {title && <h1 className="text-2xl font-bold text-white mb-2 border-none!">{title}</h1>}
                  <div className="flex flex-wrap gap-3 text-xs font-mono text-slate-500 mb-6 pb-4 border-b border-slate-700">
                    <span>{date}</span>
                    <span>•</span>
                    <span>{category}</span>
                    <span>•</span>
                    <span className={
                      difficulty === 'Hard' || difficulty === 'Critical' ? 'text-red-400' :
                      difficulty === 'Medium' ? 'text-orange-400' : 'text-green-400'
                    }>{difficulty}</span>
                    <span>•</span>
                    <span>{readTime} read</span>
                  </div>
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
                    {markdownContent}
                  </ReactMarkdown>
                </article>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600">
                  <FileText size={40} className="mb-3 opacity-40" />
                  <p className="font-mono text-sm">
                    {markdownContent ? 'Click SHOW to preview' : 'Enter content to preview'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}
