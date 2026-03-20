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
// AdminPage is lazy-loaded and only available in dev mode
const AdminPage = import.meta.env.DEV
  ? React.lazy(() => import('./AdminPage'))
  : null;
import { callGemini } from '../scripts/api';
import { USER_CONFIG } from '../data/config';
import { RESUME_DATA } from '../data/resume';
import { BLOG_POSTS } from '../data/blog';
import { TROPHIES } from '../data/trophies';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [prevTab, setPrevTab] = useState('dashboard');
  const [bootSequence, setBootSequence] = useState(true);
  const [bootFading, setBootFading] = useState(false);
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

  // Handle tab switches with transition
  const handleTabSwitch = (newTab) => {
    if (newTab === activeTab) return;
    setPrevTab(activeTab);
    setActiveTab(newTab);
  };

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

  // Secret admin access via Ctrl+Shift+A (dev mode only)
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        handleTabSwitch('admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  useEffect(() => {
    // Smooth boot sequence: staggered lines → progress → fade out
    const t1 = setTimeout(() => setBootFading(true), 2600);
    const t2 = setTimeout(() => setBootSequence(false), 3200);
    
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
        } else if (!webhookUrl) {
          console.warn("VITE_DISCORD_WEBHOOK_URL is not defined");
        }

      } catch (error) {
        setVisitorData({ ip: "UNKNOWN_HOST", location: "Uplink Failed" });
      }
    };
    fetchVisitorData();

    return () => { clearTimeout(t1); clearTimeout(t2); };
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
    const systemPrompt = "You are a Cybernetic Analysis System (Model 9). Scan the provided data log. Output in valid HTML: A code-like block <div class='font-mono text-sm'> containing: <div class='text-green-400'>[SCAN_COMPLETE]</div>, followed by <div class='text-slate-300'>TARGET: [Target Name/Machine]</div>, <div class='text-slate-300'>VECTORS: [List attack vectors]</div>, and <div class='text-cyan-400 mt-2'>// SYSTEM_NOTE:</div> followed by a one-sentence technical summary of the hack.";
    
    const prompt = `Analyze this writeup content: ${postContent}`;
    const response = await callGemini(prompt, systemPrompt);
    
    setAnalysisResult(response);
    setAnalysisLoading(false);
  };

  const bootLines = [
    { text: 'Initializing kernel...', color: 'text-green-500' },
    { text: '[ OK ] Mounted root file system.', color: 'text-green-500' },
    { text: '[ OK ] Started Network Manager.', color: 'text-green-500' },
    { text: '[ OK ] Reached target Graphical Interface.', color: 'text-green-500' },
    { text: '[ OK ] Initializing Neural Uplink...', color: 'text-green-500' },
    { text: '[ OK ] Loading threat intelligence database...', color: 'text-green-500' },
    { text: `Loading ${USER_CONFIG.username} profile interface...`, color: 'text-cyan-400' },
  ];

  if (bootSequence) {
    return (
      <div className={`h-screen w-screen bg-black text-green-500 font-mono p-10 flex flex-col justify-between text-sm leading-tight overflow-hidden relative transition-opacity duration-500 ${bootFading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Boot lines with staggered animation */}
        <div className="flex-1 flex flex-col justify-end mb-8">
          <div className="space-y-1.5">
            {bootLines.map((line, idx) => (
              <p
                key={idx}
                className={`${line.color} ${idx === bootLines.length - 1 ? 'animate-pulse' : ''}`}
                style={{
                  animation: `fadeInUp 0.4s ease-out ${idx * 0.22}s both`,
                  opacity: 0,
                }}
              >
                {line.text}
              </p>
            ))}
          </div>
        </div>

        {/* Progress bar — always visible once lines start appearing */}
        <div className="mb-4" style={{ animation: 'fadeInUp 0.5s ease-out 1.6s both' }}>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>SYSTEM_BOOT</span>
            <span className="font-mono">initializing...</span>
          </div>
          <div className="h-[3px] bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-cyan-400 rounded-full"
              style={{ animation: 'progressFill 2s ease-in-out forwards' }}
            />
          </div>
        </div>

        {/* Scanline Effect */}
        <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] bg-repeat"></div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 overflow-hidden flex relative" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-slate-950 z-0 pointer-events-none"></div>
      <div className="absolute inset-0 animated-grid-bg z-0 pointer-events-none"></div>
      <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.08)_50%)] bg-[length:100%_3px] opacity-15"></div>

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
          <NavItem id="dashboard" label="> Dashboard" icon={Cpu} activeTab={activeTab} setActiveTab={handleTabSwitch} />
          <NavItem id="blog" label="> Writeups_&_Logs" icon={FileText} activeTab={activeTab} setActiveTab={handleTabSwitch} />
          <NavItem id="resume" label="> Resume_&_Bio" icon={Terminal} activeTab={activeTab} setActiveTab={handleTabSwitch} />
          <NavItem id="achievements" label="> Trophy Room" icon={Award} activeTab={activeTab} setActiveTab={handleTabSwitch} />
          <NavItem id="contact" label="> Contact_Me" icon={Mail} activeTab={activeTab} setActiveTab={handleTabSwitch} />
          <div className="pt-4 mt-4 border-t border-slate-800/50">
             <NavItem id="assistant" label="✨ TACTICAL_AI" icon={Bot} activeTab={activeTab} setActiveTab={handleTabSwitch} special={true} />
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 text-xs font-mono text-slate-500">
          <p>System Status: <span className="text-emerald-500">ONLINE</span></p>
          <p>IP: 127.0.0.1</p>
          <p>v.2.4.1-ai_enabled</p>
        </div>
      </nav>

      {/* MOBILE NAV (Bottom Bar) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 z-50 flex justify-around p-3">
        <button onClick={() => handleTabSwitch('dashboard')} className={`transition-all duration-200 ${activeTab === 'dashboard' ? 'text-cyan-400 scale-110' : 'text-slate-500'}`}><Cpu size={22} /></button>
        <button onClick={() => handleTabSwitch('blog')} className={`transition-all duration-200 ${activeTab === 'blog' ? 'text-cyan-400 scale-110' : 'text-slate-500'}`}><FileText size={22} /></button>
        <button onClick={() => handleTabSwitch('resume')} className={`transition-all duration-200 ${activeTab === 'resume' ? 'text-cyan-400 scale-110' : 'text-slate-500'}`}><Terminal size={22} /></button>
        <button onClick={() => handleTabSwitch('achievements')} className={`transition-all duration-200 ${activeTab === 'achievements' ? 'text-cyan-400 scale-110' : 'text-slate-500'}`}><Award size={22} /></button>
        <button onClick={() => handleTabSwitch('assistant')} className={`transition-all duration-200 ${activeTab === 'assistant' ? 'text-purple-400 scale-110' : 'text-slate-500'}`}><Bot size={22} /></button>
        <button onClick={() => handleTabSwitch('contact')} className={`transition-all duration-200 ${activeTab === 'contact' ? 'text-cyan-400 scale-110' : 'text-slate-500'}`}><Mail size={22} /></button>
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

        {/* CONTENT WINDOW - Page transitions via key */}
        <div className="flex-1 relative min-h-0 page-transition" key={activeTab}>

          {/* DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <WindowFrame title="sys_overview.exe" active={true} onClose={() => {}}>
              <div className="min-h-full flex flex-col justify-center max-w-4xl mx-auto pb-20 md:pb-0">
                <div className="mb-8">
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                    <GlitchText text="HELLO, WORLD" interval={5000} />
                  </h1>
                  <div className="text-xl text-cyan-400 font-mono mb-6 min-h-[2rem]">
                    <Typewriter 
                      texts={[
                        `> ${USER_CONFIG.role}`,
                        '> Penetration Tester',
                        '> CTF Player',
                        '> Red Team Operator',
                        '> Bug Bounty Hunter'
                      ]}
                      delay={50}
                      deleteDelay={25}
                      pauseTime={2500}
                    />
                  </div>
                  <p className="text-slate-400 max-w-lg leading-relaxed mb-8 border-l-2 border-slate-700 pl-4">
                    Specializing in Web Application Security, Network Penetration Testing, and Red Team Operations. 
                    Building tools to automate the mundane and exploit the unknown.
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <button onClick={() => handleTabSwitch('blog')} className="px-6 py-2.5 bg-cyan-600/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-600/40 hover:scale-105 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all font-mono text-sm flex items-center group rounded">
                      <ChevronRight className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      READ_LATEST_LOGS
                    </button>
                    <button onClick={() => handleTabSwitch('assistant')} className="px-6 py-2.5 bg-purple-900/20 border border-purple-500/50 text-purple-300 hover:bg-purple-900/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all font-mono text-sm flex items-center group rounded">
                      <Sparkles className="mr-2 h-4 w-4 group-hover:spin-slow" />
                      OPEN_AI_UPLINK
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-lg hover:border-emerald-500/30 transition-all duration-300 group" style={{ animation: 'fadeInUp 0.5s ease-out 0.2s both' }}>
                    <div className="text-xs font-mono text-slate-500 mb-2 flex items-center">
                      <span className="w-1 h-1 bg-slate-600 rounded-full mr-1.5"></span>
                      CURRENT_STATUS
                    </div>
                    <div className="text-emerald-400 font-bold flex items-center">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2" style={{ animation: 'pulseGlow 2s ease-in-out infinite', '--cyan-glow': 'rgba(16, 185, 129, 0.4)' }}></span>
                      Open to Work
                    </div>
                  </div>
                  <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-lg hover:border-cyan-500/30 transition-all duration-300 group" style={{ animation: 'fadeInUp 0.5s ease-out 0.35s both' }}>
                    <div className="text-xs font-mono text-slate-500 mb-2 flex items-center">
                      <span className="w-1 h-1 bg-slate-600 rounded-full mr-1.5"></span>
                      LAST_COMMIT
                    </div>
                    <div className="text-slate-200 font-mono text-sm">{lastCommit}</div>
                  </div>
                  <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-lg hover:border-purple-500/30 transition-all duration-300 group" style={{ animation: 'fadeInUp 0.5s ease-out 0.5s both' }}>
                    <div className="text-xs font-mono text-slate-500 mb-2 flex items-center">
                      <span className="w-1 h-1 bg-slate-600 rounded-full mr-1.5"></span>
                      VISITOR_UPLINK
                    </div>
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
                            post.difficulty === 'Hard' || post.difficulty === 'Critical' ? 'bg-red-500/20 text-red-400' :
                            post.difficulty === 'Medium' ? 'bg-orange-500/20 text-orange-400' :
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
                          <span className={`flex items-center ${
                            selectedPost.difficulty === 'Hard' || selectedPost.difficulty === 'Critical' ? 'text-red-400' :
                            selectedPost.difficulty === 'Medium' ? 'text-orange-400' :
                            'text-green-400'
                          }`}><Lock size={14} className="mr-1"/> {selectedPost.difficulty}</span>
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
                    <a href="/Resume.pdf" download="Haridev_P_Resume.pdf" className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white font-mono text-sm rounded transition-colors flex justify-center items-center">
                      DOWNLOAD_CV.PDF
                    </a>
                  </div>
                </div>

                {/* Right Column: Experience & More */}
                <div className="lg:col-span-2 space-y-8">
                  
                  {/* Experience */}
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

                  {/* Projects */}
                  <div>
                    <h3 className="text-cyan-400 font-mono mb-6 flex items-center">
                      <Braces size={16} className="mr-2" /> PROJECT_INDEX
                    </h3>
                    <div className="relative border-l border-slate-700 ml-3 space-y-8">
                      {RESUME_DATA.projects?.map((project, idx) => (
                        <div key={idx} className="pl-8 relative group">
                          <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-slate-600 rounded-full border border-slate-900 group-hover:bg-purple-400 group-hover:shadow-[0_0_10px_rgba(192,132,252,0.5)] transition-all"></div>
                          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                            <h4 className="text-xl font-bold text-slate-200">{project.title}</h4>
                            <span className="font-mono text-xs text-purple-400/80 bg-purple-900/20 px-2 py-1 rounded">{project.period}</span>
                          </div>
                          <div className="text-sm font-mono text-slate-400 mb-3">{project.tech}</div>
                          <ul className="list-disc list-outside ml-4 space-y-1 text-slate-300">
                             {project.details.map((d, i) => <li key={i}>{d}</li>)}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <h3 className="text-cyan-400 font-mono mb-6 flex items-center">
                      <FileText size={16} className="mr-2" /> ACADEMIC_RECORDS
                    </h3>
                     <div className="space-y-6">
                      {RESUME_DATA.education?.map((edu, idx) => (
                        <div key={idx} className="bg-slate-800/30 p-4 rounded border border-slate-700 hover:border-cyan-500/50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-slate-200">{edu.institution}</h4>
                            <span className="font-mono text-xs text-slate-500">{edu.period}</span>
                          </div>
                          <div className="text-cyan-400 font-mono text-sm mb-2">{edu.degree}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <h3 className="text-cyan-400 font-mono mb-6 flex items-center">
                      <Award size={16} className="mr-2" /> CERTIFICATIONS
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {RESUME_DATA.certifications?.map((cert, idx) => (
                         <div key={idx} className="bg-slate-800/30 p-4 rounded border border-slate-700 hover:border-yellow-500/50 transition-colors">
                            <h4 className="font-bold text-slate-200 text-sm mb-1">{cert.name}</h4>
                            <p className="text-xs text-slate-400 font-mono mb-2">{cert.issuer}</p>
                            <span className="text-xs text-emerald-400 font-mono">{cert.date}</span>
                         </div>
                       ))}
                    </div>
                  </div>

                   {/* Leadership */}
                   <div>
                    <h3 className="text-cyan-400 font-mono mb-6 flex items-center">
                      <Globe size={16} className="mr-2" /> LEADERSHIP_&_EXTRACURRICULAR
                    </h3>
                    <div className="relative border-l border-slate-700 ml-3 space-y-8">
                       {RESUME_DATA.leadership?.map((item, idx) => (
                        <div key={idx} className="pl-8 relative group">
                           <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-slate-600 rounded-full border border-slate-900 group-hover:bg-emerald-400 transition-all"></div>
                           <h4 className="text-lg font-bold text-slate-200">{item.role}</h4>
                           <div className="text-sm font-mono text-slate-400 mb-2">{item.organization} | {item.period}</div>
                           <ul className="list-disc list-outside ml-4 space-y-1 text-slate-300">
                             {item.details.map((d, i) => <li key={i}>{d}</li>)}
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
                    <div className="w-16 h-16 mb-4 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-2xl font-bold font-mono text-slate-400 group-hover:border-cyan-400 group-hover:text-cyan-400 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300" style={{ animation: 'float 3s ease-in-out infinite', animationDelay: `${idx * 0.5}s` }}>
                      {trophy.icon === 'GDSC' ? <Globe size={32} /> : trophy.icon === 'GCP' ? <Cloud size={32} /> : trophy.icon}
                    </div>
                    <h3 className="font-bold text-slate-200 mb-1">{trophy.title}</h3>
                    <p className="text-xs font-mono text-slate-500">{trophy.issuer}</p>
                    <div className="mt-4 text-xs bg-slate-800/80 px-3 py-1.5 rounded-full text-slate-400 border border-slate-700 font-mono">
                      ACQUIRED: {trophy.date}
                    </div>
                    </>
                  );

                  const cardClasses = `bg-gradient-to-br from-slate-800/80 to-slate-900 p-6 rounded-lg border border-slate-700 flex flex-col items-center text-center group hover:-translate-y-2 hover:border-cyan-500/50 hover:shadow-[0_8px_30px_rgba(6,182,212,0.15)] transition-all duration-300 relative overflow-hidden`;

                  return trophy.link ? (
                    <a key={idx} href={trophy.link} target="_blank" rel="noreferrer" className={`${cardClasses} cursor-pointer`} style={{ animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s both` }}>
                      {content}
                    </a>
                  ) : (
                    <div key={idx} className={cardClasses} style={{ animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s both` }}>
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

          {/* ADMIN VIEW (Dev-only - accessed via Ctrl+Shift+A) */}
          {import.meta.env.DEV && activeTab === 'admin' && AdminPage && (
            <React.Suspense fallback={<div className="text-center text-slate-500 font-mono p-10">Loading admin...</div>}>
              <AdminPage onBack={() => handleTabSwitch('dashboard')} />
            </React.Suspense>
          )}

        </div>
      </main>
    </div>
  );
}
