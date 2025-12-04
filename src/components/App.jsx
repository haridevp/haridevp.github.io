import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, FileText, Award, Mail, Cpu, Globe, ChevronRight, Hash, ExternalLink, Lock, Minimize2, Maximize2, X, Download, Bot, Sparkles, Send, Github, Linkedin, Braces, Cloud, Instagram } from 'lucide-react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkAlert } from 'remark-github-blockquote-alert';
import 'github-markdown-css/github-markdown-dark.css';
import 'katex/dist/katex.min.css';
// Imports
import Typewriter from './Typewriter';
import GlitchText from './GlitchText';
import WindowFrame from './WindowFrame';
import NavItem from './NavItem';
import CodeBlock from './CodeBlock';
import { callGemini } from '../scripts/api';
import { USER_CONFIG } from '../data/config';
import { RESUME_DATA } from '../data/resume';
import { BLOG_POSTS } from '../data/blog';
import { TROPHIES } from '../data/trophies';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bootSequence, setBootSequence] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [lastCommit, setLastCommit] = useState("Loading...");
  const [visitorData, setVisitorData] = useState({ ip: "Scanning...", location: "Triangulating..." });
  
  // AI States
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "model", text: "Secure uplink established. I am your Tactical Operations AI. Awaiting commands." }
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const chatEndRef = useRef(null);

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

  useEffect(() => {
    // Simulate boot sequence
    const timer = setTimeout(() => setBootSequence(false), 2500);
    
    // Fetch Github Last Commit
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
            console.error("Error fetching Github data:", error);
            setLastCommit("Offline");
        }
    };
    fetchLastCommit();

    // Fetch Visitor Data
    const fetchVisitorData = async () => {
      let ipv4 = "Unknown";
      let ipv6 = "Not Detected";
      let location = "Triangulating...";
      let isp = "Unknown";

      try {
        // 1. Get IPv4 (Mandatory for Dashboard)
        try {
            const v4Res = await fetch('https://api.ipify.org?format=json');
            const v4Data = await v4Res.json();
            ipv4 = v4Data.ip;
        } catch (e) { console.error("IPv4 fetch failed", e); }

        // 2. Get IPv6 (For Webhook)
        try {
            const v6Res = await fetch('https://api6.ipify.org?format=json');
            const v6Data = await v6Res.json();
            ipv6 = v6Data.ip;
        } catch (e) { /* IPv6 might not be available */ }

        // 3. Get Location & ISP
        try {
            const locRes = await fetch('https://ipapi.co/json/');
            const locData = await locRes.json();
            if (!locData.error) {
                location = `${locData.city}, ${locData.country_code}`;
                isp = locData.org;
            }
        } catch (e) { console.error("Location fetch failed", e); }

        // Update Dashboard (Show IPv4 only)
        setVisitorData({ 
          ip: ipv4, 
          location: location 
        });

        // Send to Discord Webhook
        const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
        if (webhookUrl && !sessionStorage.getItem('notified')) {
          try {
            await fetch(webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                content: `🚨 **Incoming Connection Detected**\n**IPv4:** ${ipv4}\n**IPv6:** ${ipv6}\n**Location:** ${location}\n**ISP:** ${isp}\n**User Agent:** ${navigator.userAgent}`
              })
            });
            sessionStorage.setItem('notified', 'true');
          } catch (err) { 
            console.error("Webhook Error:", err);
          }
        }

      } catch (error) {
        setVisitorData({ ip: "UNKNOWN_HOST", location: "Uplink Failed" });
      }
    };
    fetchVisitorData();

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatInput("");
    setChatHistory(prev => [...prev, { role: "user", text: userMsg }]);
    setIsAiThinking(true);

    const systemPrompt = "You are a specialized Cybersecurity AI Assistant named 'OpSec-9'. You speak in a concise, technical, and slightly 'hacker' persona (like a CLI tool or a military briefing). You help with shell commands, explaining vulnerabilities, and CTF hints. Do not provide illegal or malicious instructions for real-world harm, but do assist with educational/defensive security concepts.";

    const response = await callGemini(userMsg, systemPrompt);
    
    setChatHistory(prev => [...prev, { role: "model", text: response }]);
    setIsAiThinking(false);
  };

  const handleAnalyzePost = async (postContent) => {
    setAnalysisLoading(true);
    setAnalysisResult(null);
    const systemPrompt = "You are a Senior Threat Intelligence Analyst. Analyze the provided security writeup. Output your response in valid HTML format (no markdown fences, just the inner HTML) with the following structure: A div with class 'mb-4' containing a <h4 class='text-cyan-400 font-bold mb-2'>EXECUTIVE BRIEF</h4> and a <p class='text-slate-300 text-sm'> summary. Then a div containing <h4 class='text-cyan-400 font-bold mb-2'>CRITICAL VULNERABILITY</h4> and a <p class='text-slate-300 text-sm'> explanation. Finally a div with <h4 class='text-green-400 font-bold mb-2'>REMEDIATION STRATEGY</h4> and a <p class='text-slate-300 text-sm'> recommendation.";
    
    const prompt = `Analyze this writeup content: ${postContent}`;
    const response = await callGemini(prompt, systemPrompt);
    
    setAnalysisResult(response);
    setAnalysisLoading(false);
  };

  if (bootSequence) {
    return (
      <div className="h-screen w-screen bg-black text-green-500 font-mono p-10 flex flex-col justify-end text-sm leading-tight overflow-hidden">
        <div className="space-y-1">
          <p>Initializing kernel...</p>
          <p>[ OK ] Mounted root file system.</p>
          <p>[ OK ] Started Network Manager.</p>
          <p>[ OK ] Reached target Graphical Interface.</p>
          <p>[ OK ] Initializing Neural Uplink...</p>
          <p className="text-cyan-400 animate-pulse">Loading {USER_CONFIG.username} profile interface...</p>
        </div>
        {/* Scanline Effect */}
        <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] bg-repeat"></div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 overflow-hidden flex relative">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-slate-950 z-0 pointer-events-none"></div>
      <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_3px] opacity-20"></div>

      {/* SIDEBARNAVIGATION */}
      <nav className="w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-md flex-shrink-0 z-10 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded bg-cyan-500/10 flex items-center justify-center border border-cyan-500/50">
              <Shield className="text-cyan-400" size={20} />
            </div>
            <div>
              <h1 className="font-mono font-bold text-cyan-50 text-sm tracking-wider">HARIDEV_P</h1>
              <p className="text-xs text-cyan-400 font-mono">Sec_Research_Unit</p>
            </div>
          </div>
        </div>

        <div className="flex-1 py-6 space-y-1">
          <NavItem id="dashboard" label="> Dashboard" icon={Cpu} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="blog" label="> Writeups_&_Logs" icon={FileText} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="resume" label="> Resume_&_Bio" icon={Terminal} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="achievements" label="> Trophy Room" icon={Award} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="contact" label="> Contact_Me" icon={Mail} activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="pt-4 mt-4 border-t border-slate-800/50">
             <NavItem id="assistant" label="✨ TACTICAL_AI" icon={Bot} activeTab={activeTab} setActiveTab={setActiveTab} special={true} />
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 text-xs font-mono text-slate-500">
          <p>System Status: <span className="text-emerald-500">ONLINE</span></p>
          <p>IP: 127.0.0.1</p>
          <p>v.2.4.1-ai_enabled</p>
        </div>
      </nav>

      {/* MOBILE NAV (Bottom Bar) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 flex justify-around p-3">
        <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'text-cyan-400' : 'text-slate-500'}><Cpu size={24} /></button>
        <button onClick={() => setActiveTab('blog')} className={activeTab === 'blog' ? 'text-cyan-400' : 'text-slate-500'}><FileText size={24} /></button>
        <button onClick={() => setActiveTab('assistant')} className={activeTab === 'assistant' ? 'text-purple-400' : 'text-slate-500'}><Bot size={24} /></button>
        <button onClick={() => setActiveTab('contact')} className={activeTab === 'contact' ? 'text-cyan-400' : 'text-slate-500'}><Mail size={24} /></button>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 overflow-hidden flex flex-col z-10 relative">
        
        {/* HEADER */}
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2 text-sm font-mono text-slate-400">
            <span>root@{USER_CONFIG.hostname}:</span>
            <span className={activeTab === 'assistant' ? "text-purple-400" : "text-blue-400"}>~/{activeTab}</span>
            <span className="animate-pulse text-slate-200">_</span>
          </div>
          <div className="flex space-x-4">
            <a href={USER_CONFIG.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors"><Github size={20} /></a>
            <a href={USER_CONFIG.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
            <a href={USER_CONFIG.googleDev} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors"><Braces size={20} /></a>
            <a href={USER_CONFIG.instagram} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors"><Instagram size={20} /></a>
          </div>
        </header>

        {/* CONTENT WINDOW */}
        <div className="flex-1 relative min-h-0">

          {/* DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <WindowFrame title="sys_overview.exe" active={true} onClose={() => {}}>
              <div className="min-h-full flex flex-col justify-center max-w-4xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                    <GlitchText text="HELLO, WORLD" />
                  </h1>
                  <div className="text-xl text-cyan-400 font-mono mb-6 h-8">
                    <Typewriter text={`> ${USER_CONFIG.role}`} />
                  </div>
                  <p className="text-slate-400 max-w-lg leading-relaxed mb-8 border-l-2 border-slate-700 pl-4">
                    Specializing in Web Application Security, Network Penetration Testing, and Red Team Operations. 
                    Building tools to automate the mundane and exploit the unknown.
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <button onClick={() => setActiveTab('blog')} className="px-6 py-2 bg-cyan-600/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-600/40 hover:scale-105 transition-all font-mono text-sm flex items-center group">
                      <ChevronRight className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      READ_LATEST_LOGS
                    </button>
                    <button onClick={() => setActiveTab('assistant')} className="px-6 py-2 bg-purple-900/20 border border-purple-500/50 text-purple-300 hover:bg-purple-900/40 transition-all font-mono text-sm flex items-center group">
                      <Sparkles className="mr-2 h-4 w-4 group-hover:spin-slow" />
                      OPEN_AI_UPLINK
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-800/50 border border-slate-700 rounded">
                    <div className="text-xs font-mono text-slate-500 mb-2">CURRENT_STATUS</div>
                    <div className="text-emerald-400 font-bold flex items-center">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                      Open to Work
                    </div>
                  </div>
                  <div className="p-4 bg-slate-800/50 border border-slate-700 rounded">
                    <div className="text-xs font-mono text-slate-500 mb-2">LAST_COMMIT</div>
                    <div className="text-slate-200">{lastCommit}</div>
                  </div>
                  <div className="p-4 bg-slate-800/50 border border-slate-700 rounded">
                    <div className="text-xs font-mono text-slate-500 mb-2">VISITOR_UPLINK</div>
                    <div className="text-cyan-400 font-mono text-sm">{visitorData.ip}</div>
                    <div className="text-xs text-emerald-400 font-mono mt-1">{visitorData.location}</div>
                  </div>
                </div>
              </div>
            </WindowFrame>
          )}

          {/* AI ASSISTANT VIEW */}
          {activeTab === 'assistant' && (
             <WindowFrame title="neural_uplink_v2.bin" active={true} onClose={() => setActiveTab('dashboard')} scrollable={false}> 
               <div className="flex flex-col h-full max-w-4xl mx-auto p-4 pb-20 md:pb-4 min-h-0">
                 <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
                   {chatHistory.map((msg, idx) => (
                     <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                       <div className={`max-w-[80%] p-3 rounded font-mono text-sm ${ 
                         msg.role === 'user' 
                           ? 'bg-cyan-900/30 border border-cyan-500/30 text-cyan-100'
                           : 'bg-slate-800/80 border border-slate-600 text-slate-300'
                       }`}>
                         {msg.role === 'model' && <Bot size={14} className="mb-2 text-purple-400" />}
                         <div className="whitespace-pre-wrap">{msg.text}</div>
                       </div>
                     </div>
                   ))}
                   {isAiThinking && (
                     <div className="flex justify-start">
                       <div className="bg-slate-800/80 border border-slate-600 p-3 rounded text-slate-400 text-xs font-mono animate-pulse flex items-center">
                         <Sparkles size={12} className="mr-2" /> PROCESSING_REQUEST...
                       </div>
                     </div>
                   )}
                   <div ref={chatEndRef} />
                 </div>
                 
                 <form onSubmit={handleChatSubmit} className="relative">
                   <input
                     type="text"
                     value={chatInput}
                     onChange={(e) => setChatInput(e.target.value)}
                     placeholder="Enter command or query..."
                     className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-4 pr-12 rounded focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all font-mono shadow-lg"
                     disabled={isAiThinking}
                   />
                   <button 
                     type="submit" 
                     disabled={!chatInput.trim() || isAiThinking}
                     className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-purple-400 disabled:opacity-50 transition-colors"
                   >
                     <Send size={20} />
                   </button>
                 </form>
               </div>
             </WindowFrame>
          )}

          {/* BLOG VIEW */}
          {activeTab === 'blog' && (
            <div className="h-full flex gap-4">
              {/* Blog List (Sidebar style) */}
              <div className={`flex-1 md:max-w-md ${selectedPost ? 'hidden md:block' : 'block'}`}>
                <WindowFrame title="mission_logs.db" active={true} onClose={() => {}} scrollable={false}>
                  <div className="space-y-2 h-full overflow-auto custom-scrollbar p-4 pb-20 min-h-0">
                    {BLOG_POSTS.map(post => (
                      <div 
                        key={post.id} 
                        onClick={() => { setSelectedPost(post); setAnalysisResult(null); }}
                        className={`p-4 border border-slate-800 rounded hover:border-cyan-500/50 hover:bg-slate-800/50 cursor-pointer transition-all group ${ 
                          selectedPost?.id === post.id 
                            ? 'bg-slate-800 border-cyan-500' 
                            : 'bg-slate-900 opacity-90 hover:opacity-100'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-xs font-mono px-2 py-0.5 rounded ${ 
                            post.difficulty === 'Critical' ? 'bg-red-500/20 text-red-400' :
                            post.difficulty === 'Hard' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            [{post.difficulty.toUpperCase()}]
                          </span>
                          <span className="text-xs text-slate-500 font-mono">{post.date}</span>
                        </div>
                        <h3 className="text-slate-200 font-bold mb-1 group-hover:text-cyan-400 transition-colors">{post.title}</h3>
                        <div className="flex items-center text-xs text-slate-500 space-x-3">
                          <span>{post.category}</span>
                          <span>•</span>
                          <span>{post.readTime} read</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </WindowFrame>
              </div>

              {/* Blog Content (Reader) */}
              <div className={`flex-[2] min-w-0 ${selectedPost ? 'block' : 'hidden md:block'}`}>
                <WindowFrame title={selectedPost ? `reading: ${selectedPost.title}` : "viewer_idle"} active={!!selectedPost} onClose={() => setSelectedPost(null)}>
                  {selectedPost ? (
                    <article className="max-w-3xl mx-auto font-sans leading-relaxed text-slate-300 max-w-full">
                      <div className="flex justify-between items-start mb-4">
                         <button onClick={() => setSelectedPost(null)} className="md:hidden text-xs text-cyan-400 font-mono underline">&lt; BACK_TO_LIST</button>
                         <button 
                            onClick={() => handleAnalyzePost(selectedPost.content)}
                            disabled={analysisLoading}
                            className="ml-auto px-3 py-1 bg-purple-900/30 border border-purple-500/50 text-purple-300 text-xs font-mono hover:bg-purple-900/50 transition-all flex items-center"
                         >
                            <Sparkles size={12} className={`mr-2 ${analysisLoading ? 'animate-spin' : ''}`} /> 
                            {analysisLoading ? "DECRYPTING_INTEL..." : "✨ ANALYZE_INTEL"}
                         </button>
                      </div>
                      
                      {/* Analysis Result Modal / Section */}
                      {analysisResult && (
                        <div className="mb-8 p-4 bg-slate-800/80 border border-purple-500/50 rounded-lg shadow-lg relative overflow-hidden animate-in fade-in slide-in-from-top-4">
                           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500"></div>
                           <h3 className="text-xs font-bold text-purple-300 mb-4 font-mono flex items-center">
                             <Bot size={14} className="mr-2" /> AUTOMATED_THREAT_REPORT
                           </h3>
                           <div dangerouslySetInnerHTML={{__html: analysisResult}} />
                        </div>
                      )}

                      <div className="border-b border-slate-700 pb-6 mb-6">
                        <h1 className="text-3xl font-bold text-white mb-4 break-words">{selectedPost.title}</h1>
                        <div className="flex flex-wrap gap-4 text-sm font-mono text-slate-400">
                          <span className="flex items-center"><Hash size={14} className="mr-1"/> {selectedPost.category}</span>
                          <span className="flex items-center text-cyan-400"><Lock size={14} className="mr-1"/> {selectedPost.difficulty}</span>
                        </div>
                      </div>

                      <div className="markdown-body bg-transparent text-slate-300 font-sans leading-relaxed text-base">
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
                    </article>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600">
                      <FileText size={48} className="mb-4 opacity-50" />
                      <p className="font-mono">SELECT_FILE_TO_READ</p>
                    </div>
                  )}
                </WindowFrame>
              </div>
            </div>
          )}

          {/* RESUME VIEW */}
          {activeTab === 'resume' && (
            <WindowFrame title="personnel_file.dat" active={true} onClose={() => {}}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Skills */}
                <div className="space-y-8">
                  <div className="bg-slate-800/30 p-4 rounded border border-slate-700">
                    <h3 className="text-cyan-400 font-mono mb-4 border-b border-slate-700 pb-2 flex items-center">
                      <Cpu size={16} className="mr-2" /> SKILL_MATRIX
                    </h3>
                    <div className="space-y-6">
                      {RESUME_DATA.skills.map((skillGroup, idx) => (
                        <div key={idx}>
                          <h4 className="text-xs text-slate-400 uppercase tracking-wider mb-2">{skillGroup.category}</h4>
                          <div className="flex flex-wrap gap-2">
                            {skillGroup.items.map((skill, sIdx) => (
                              <span key={sIdx} className="px-2 py-1 bg-slate-900 border border-slate-600 rounded text-xs text-cyan-100 hover:border-cyan-500 transition-colors">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/30 p-4 rounded border border-slate-700">
                     <h3 className="text-cyan-400 font-mono mb-4 border-b border-slate-700 pb-2 flex items-center">
                      <Download size={16} className="mr-2" /> EXPORT
                    </h3>
                    <button className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white font-mono text-sm rounded transition-colors flex justify-center items-center">
                      DOWNLOAD_CV.PDF
                    </button>
                  </div>
                </div>

                {/* Right Column: Experience */}
                <div className="lg:col-span-2 space-y-8">
                  <div>
                    <h3 className="text-cyan-400 font-mono mb-6 flex items-center">
                      <Terminal size={16} className="mr-2" /> EXPERIENCE_LOG
                    </h3>
                    <div className="relative border-l border-slate-700 ml-3 space-y-8">
                      {RESUME_DATA.experience.map((job, idx) => (
                        <div key={idx} className="pl-8 relative group">
                          {/* Timeline Dot */}
                          <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-slate-600 rounded-full border border-slate-900 group-hover:bg-cyan-400 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all"></div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                            <h4 className="text-xl font-bold text-slate-200">{job.role}</h4>
                            <span className="font-mono text-xs text-cyan-500/80 bg-cyan-950/30 px-2 py-1 rounded">{job.period}</span>
                          </div>
                          <div className="text-sm font-mono text-slate-400 mb-3">@ {job.company}</div>
                          <ul className="list-disc list-outside ml-4 space-y-1 text-slate-300">
                            {job.details.map((detail, dIdx) => (
                              <li key={dIdx}>{detail}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </WindowFrame>
          )}

          {/* ACHIEVEMENTS VIEW */}
          {activeTab === 'achievements' && (
            <WindowFrame title="trophy_room.exe" active={true} onClose={() => {}}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {TROPHIES.map((trophy, idx) => {
                  const content = (
                    <>
                    <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="w-16 h-16 mb-4 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-2xl font-bold font-mono text-slate-400 group-hover:border-cyan-400 group-hover:text-cyan-400 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all">
                      {trophy.icon === 'GDSC' ? <Globe size={32} /> : trophy.icon === 'GCP' ? <Cloud size={32} /> : trophy.icon}
                    </div>
                    <h3 className="font-bold text-slate-200 mb-1">{trophy.title}</h3>
                    <p className="text-xs font-mono text-slate-500">{trophy.issuer}</p>
                    <div className="mt-4 text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700">
                      ACQUIRED: {trophy.date}
                    </div>
                    </>
                  );

                  return trophy.link ? (
                    <a key={idx} href={trophy.link} target="_blank" rel="noreferrer" className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-lg border border-slate-700 flex flex-col items-center text-center group hover:-translate-y-1 hover:border-cyan-500/50 transition-all duration-300 relative overflow-hidden cursor-pointer">
                      {content}
                    </a>
                  ) : (
                    <div key={idx} className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-lg border border-slate-700 flex flex-col items-center text-center group hover:-translate-y-1 hover:border-cyan-500/50 transition-all duration-300 relative overflow-hidden">
                      {content}
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-8">
                 <h3 className="text-slate-400 font-mono mb-4 border-b border-slate-700 pb-2">LIVE_STATS</h3>
                 <div className="grid grid-cols-1 gap-6">
                    {/* TryHackMe Badge */}
                    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 flex flex-col items-center justify-center hover:border-cyan-500/50 transition-all group overflow-hidden">
                       <h4 className="text-cyan-400 font-mono text-sm mb-4 group-hover:text-cyan-300 transition-colors">TRYHACKME_RANK</h4>
                       <iframe 
                         src={`https://tryhackme.com/api/v2/badges/public-profile?userPublicId=${USER_CONFIG.thmUserPublicId}`}
                         style={{ border: 'none' }}
                         className="w-full h-52 overflow-hidden"
                         title="TryHackMe Stats"
                         scrolling="no"
                       ></iframe>
                    </div>
                 </div>
              </div>
            </WindowFrame>
          )}

          {/* CONTACT VIEW */}
          {activeTab === 'contact' && (
            <WindowFrame title="secure_uplink.sh" active={true} onClose={() => {}}>
               <div className="max-w-2xl mx-auto pt-10">
                 <div className="bg-black/50 p-6 rounded border border-slate-700 font-mono text-sm shadow-xl">
                   <div className="text-slate-500 mb-4 border-b border-slate-800 pb-2">
                     Establishing encrypted connection to {USER_CONFIG.email}...
                   </div>
                   
                   <form className="space-y-4" onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.target);
                     const sender = formData.get('sender');
                     const email = formData.get('email');
                     const message = formData.get('message');
                     window.location.href = `mailto:${USER_CONFIG.email}?subject=Portfolio Contact from ${sender}&body=${message}%0D%0A%0D%0A--------------------------------%0D%0ASender Details:%0D%0AName: ${sender}%0D%0AEmail: ${email}`;
                   }}>
                     <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <label className="block text-cyan-400 mb-1">{'>'} SENDER_ID</label>
                          <input name="sender" required type="text" className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all" placeholder="Enter your name" />
                        </div>
                        <div className="flex-1">
                          <label className="block text-cyan-400 mb-1">{'>'} RETURN_ADDRESS</label>
                          <input name="email" required type="email" className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all" placeholder="Enter your email" />
                        </div>
                     </div>
                     <div>
                        <label className="block text-cyan-400 mb-1">{'>'} PAYLOAD</label>
                        <textarea name="message" required rows={6} className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all" placeholder="Type your message here..."></textarea>
                     </div>
                     <button type="submit" className="w-full py-3 bg-cyan-900/30 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-black font-bold tracking-wider transition-all uppercase flex justify-center items-center group">
                        <Mail className="mr-2 group-hover:animate-bounce" size={16} /> Transmit_Data
                     </button>
                   </form>
                 </div>
               </div>
            </WindowFrame>
          )}

        </div>
      </main>
    </div>
  );
}
