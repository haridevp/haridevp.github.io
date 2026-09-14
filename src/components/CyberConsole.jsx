import React, { useState } from 'react';
import { Terminal, Shield, Play, RotateCcw, ChevronRight, CheckCircle2 } from 'lucide-react';
import { USER_CONFIG } from '../data/config';
import { RESUME_DATA } from '../data/resume';

const COMMANDS = {
  whoami: {
    label: 'whoami',
    output: [
      `OPERATOR : ${USER_CONFIG.username}`,
      `ROLE     : ${USER_CONFIG.role}`,
      `LAB      : ASTRA Lab (CyStar), IIT Madras (Security Research Intern)`,
      `FOCUS    : Adversary Emulation, C2 Infrastructure, AD Exploitation, Windows Internals`,
      `STATUS   : Active Research • Available for Offensive Security / Red Team roles`
    ]
  },
  experience: {
    label: 'cat experience',
    output: [
      `[+] ASTRA Lab (CyStar), IIT Madras (May 2026 – Present)`,
      `    Role: Security Research Intern | Location: Chennai, TN`,
      `    Advisors: Prof. Narayanaswamy N S & Dr. Jaimandeep Singh (Senior Consultant, ex-MoD)`,
      `    Research: CipherC2 (Confidential Lab Project) - adversary C2 TTPs & initial access vectors`,
      `    Domain: Windows internals evasion strategies & MITRE ATT&CK framework mapping`
    ]
  },
  'c2-framework': {
    label: 'cat c2',
    output: [
      `[!] PROJECT: Stealth C2 Framework [v1.0 Release]`,
      `    • Egress: Discord API HTTPS tunneling (bypasses egress firewalls)`,
      `    • Cryptography: AES-256-GCM end-to-end encrypted packet protocol`,
      `    • Steganography: 7 operator commands mapped to innocuous chat emojis`,
      `    • Anti-Forensics: Automated kill-switch against Wireshark, ProcMon, Cuckoo`
    ]
  },
  skills: {
    label: 'cat skills',
    output: [
      `[+] CORE CAPABILITIES:`,
      `    • Offensive: Active Directory Exploitation, C2 Infra, Post-Exploitation, Red Teaming`,
      `    • Tooling  : Impacket, BloodHound, Burp Suite, Nmap, Wireshark, Metasploit`,
      `    • Systems  : Linux (Kali, Fedora), Windows Server 2022, Active Directory`,
      `    • Ranks    : TryHackMe (ArtemizZ - Top 30%) | HTB (Level 12 - 13 Machines)`
    ]
  },
  mitre: {
    label: 'cat mitre',
    output: [
      `[+] MITRE ATT&CK TTP MATRIX COVERAGE:`,
      `    • TA0001 [Initial Access]        : DeepTrustxAI workshop speaker, custom phishing & payloads`,
      `    • TA0004 [Privilege Escalation] : Enterprise AD Lab (Kerberoasting, Pass-the-Hash)`,
      `    • TA0008 [Lateral Movement]     : SMB relay, BloodHound attack path auditing`,
      `    • TA0011 [Command & Control]    : CipherC2 research & Stealth-C2 Discord conduit`
    ]
  }
};

export default function CyberConsole() {
  const [history, setHistory] = useState([
    {
      cmd: 'whoami',
      output: COMMANDS.whoami.output
    }
  ]);
  const [inputVal, setInputVal] = useState('');

  const executeCommand = (cmdKey) => {
    const cleanCmd = cmdKey.trim().toLowerCase();

    if (cleanCmd === 'clear' || cleanCmd === 'cls') {
      setHistory([]);
      setInputVal('');
      return;
    }

    if (cleanCmd === 'help') {
      setHistory(prev => [
        ...prev,
        {
          cmd: 'help',
          output: [
            'Available commands:',
            '  whoami         - View operator clearance & credentials',
            '  experience     - Read current research at IIT Madras',
            '  c2             - Inspect Stealth C2 framework architecture',
            '  skills         - List offensive tradecraft & tools',
            '  mitre          - View MITRE ATT&CK TTP matrix',
            '  clear          - Clear terminal display'
          ]
        }
      ]);
      setInputVal('');
      return;
    }

    let foundKey = Object.keys(COMMANDS).find(
      key => key === cleanCmd || COMMANDS[key].label.toLowerCase() === cleanCmd || (cleanCmd.startsWith('cat ') && cleanCmd.includes(key))
    );

    if (cleanCmd === 'c2') foundKey = 'c2-framework';

    if (foundKey && COMMANDS[foundKey]) {
      setHistory(prev => [
        ...prev.slice(-3), // Keep recent history clean
        {
          cmd: COMMANDS[foundKey].label,
          output: COMMANDS[foundKey].output
        }
      ]);
    } else {
      setHistory(prev => [
        ...prev.slice(-3),
        {
          cmd: cleanCmd,
          output: [`command not found: "${cleanCmd}". Click a quick command below or type 'help'.`]
        }
      ]);
    }

    setInputVal('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      executeCommand(inputVal);
    }
  };

  return (
    <div className="cyber-terminal-card overflow-hidden rounded-xl border border-cyan-500/25 bg-[#0a0d18]/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,240,255,0.08)]">
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 bg-[#070912] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500/80 border border-red-400/50" />
          <div className="h-3 w-3 rounded-full bg-amber-500/80 border border-amber-400/50" />
          <div className="h-3 w-3 rounded-full bg-emerald-500/80 border border-emerald-400/50" />
          <span className="ml-2 font-mono text-xs font-semibold tracking-wider text-gray-400 flex items-center gap-1.5">
            <Terminal size={13} className="text-cyan-400" />
            astra-telemetry://kali-node
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            TTPs LOADED
          </span>
          <button
            onClick={() => setHistory([])}
            className="text-gray-500 hover:text-cyan-400 transition-colors p-1"
            title="Clear console"
            aria-label="Clear console"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* Terminal Screen Body */}
      <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm text-gray-300 min-h-[190px] max-h-[290px] overflow-y-auto space-y-3 scrollbar-thin">
        <div className="text-gray-500 text-xs">
          /* Haridev P — Tactical Cyber Intelligence Terminal v2.4 */
        </div>

        {history.map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400">
              <span className="text-emerald-400">root@astra-redteam</span>
              <span className="text-gray-500">:</span>
              <span className="text-blue-400">~#</span>
              <span className="text-white font-medium">{item.cmd}</span>
            </div>
            <div className="pl-3 border-l border-cyan-500/20 space-y-1 text-gray-300 text-xs sm:text-[13px] leading-relaxed">
              {item.output.map((line, lIdx) => (
                <div
                  key={lIdx}
                  className={
                    line.startsWith('[+]')
                      ? 'text-cyan-300 font-semibold'
                      : line.startsWith('[!]')
                      ? 'text-amber-300 font-semibold'
                      : 'text-gray-300'
                  }
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Input line */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1">
          <span className="text-emerald-400 flex-shrink-0">root@astra-redteam</span>
          <span className="text-gray-500">:</span>
          <span className="text-blue-400 flex-shrink-0">~#</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="type 'help' or click a command below..."
            className="w-full bg-transparent text-white font-mono text-xs sm:text-sm outline-none border-none placeholder-gray-600 focus:ring-0 p-0"
          />
        </form>
      </div>

      {/* Quick Command Bar (Tap to Execute) */}
      <div className="border-t border-cyan-500/20 bg-[#070912]/90 p-2.5 sm:px-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] uppercase font-mono tracking-wider text-gray-500 flex-shrink-0 mr-1 hidden sm:inline">
          Quick EXEC:
        </span>
        {Object.entries(COMMANDS).map(([key, info]) => (
          <button
            key={key}
            onClick={() => executeCommand(key)}
            className="flex-shrink-0 rounded-md border border-cyan-500/25 bg-cyan-500/5 px-2.5 py-1 font-mono text-[11px] font-medium text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 hover:text-white transition-all active:scale-95 flex items-center gap-1"
          >
            <ChevronRight size={11} className="text-cyan-400" />
            {info.label}
          </button>
        ))}
      </div>
    </div>
  );
}
