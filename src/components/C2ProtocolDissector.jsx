import React, { useState } from 'react';
import {
  Shield, Terminal, Lock, ArrowRight, Play, CheckCircle2,
  AlertTriangle, RefreshCw, Eye, EyeOff, Radio, Cpu, Sparkles,
  ExternalLink, Copy, Check
} from 'lucide-react';
import { USER_CONFIG } from '../data/config';

const C2_COMMANDS = [
  {
    emoji: '🐚',
    name: 'System Info',
    action: 'sysinfo',
    desc: 'Query OS version, hostname, CPU architecture, active user privileges',
    sampleOutput: 'OS: Windows 11 Pro 23H2 (Build 22631.3007) | Host: DEV-STATION-04 | User: CORP\\hdev (Standard User)'
  },
  {
    emoji: '📸',
    name: 'Surveillance',
    action: 'screenshot',
    desc: 'MSS native screen capture; graceful fallback to webcam if desktop is locked',
    sampleOutput: '[+] Captured primary display (1920x1080) -> encrypted buffer (241 KB)'
  },
  {
    emoji: '📂',
    name: 'Exfiltrate File',
    action: 'exfil C:\\confidential\\plan.pdf',
    desc: 'Client-side AES-256-GCM encryption before multipart Discord attachment upload',
    sampleOutput: '[+] Encrypted "plan.pdf" (1.4 MB) with session key -> plan.pdf.enc uploaded to channel'
  },
  {
    emoji: '⚡',
    name: 'Remote Exec',
    action: 'whoami /priv',
    desc: 'Injection-safe execution via subprocess without invoking interactive cmd.exe shell',
    sampleOutput: 'SeChangeNotifyPrivilege: Enabled\nSeIncreaseWorkingSetPrivilege: Enabled'
  },
  {
    emoji: '🔄',
    name: 'Persistence',
    action: 'persist',
    desc: 'User-level systemd service (Linux) or shell:startup injection (Windows)',
    sampleOutput: '[+] Injected startup shortcut into %APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs\\Startup'
  },
  {
    emoji: '🔑',
    name: 'Rotate Key',
    action: 'rotate-key',
    desc: 'Generate new AES-256 secret, archive previous key with ISO timestamp for exfil recovery',
    sampleOutput: '[+] Rotated AES-256-GCM key. Archived previous key to ~/.stealth_c2/key_20261109T120000Z.bin.bak'
  },
  {
    emoji: '🛑',
    name: 'Kill Switch',
    action: 'kill',
    desc: 'Instant process termination, memory wipe, and file purge if sandbox/debugger detected',
    sampleOutput: '[!] Self-destruct sequence invoked. Erasing session artifacts and terminating agent.'
  }
];

// Safely encode any UTF-8 string (including emojis) to Base64
const safeBase64 = (str) => {
  try {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } catch {
    return 'W1NURUFMVEgtQzJdOjpTRVNTSU9OX0VOQ1JZUFRFRF9QQUNLRVQ=';
  }
};

export default function C2ProtocolDissector() {
  const [selectedCmd, setSelectedCmd] = useState(C2_COMMANDS[0]);
  const [customInput, setCustomInput] = useState('');
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [simulatedSandbox, setSimulatedSandbox] = useState(false);

  const commandText = customInput.trim() ? customInput.trim() : selectedCmd.action;
  const currentEmoji = customInput.trim() ? '⚡' : selectedCmd.emoji;

  // Generate deterministic-looking IV & ciphertext preview for education
  const pseudoIv = "a9f3b2c1e8471029c564d2e1";
  const pseudoTag = "e481b99201f8ca3199bc113941fe0a81";
  const pseudoCipher = safeBase64(`[STEALTH-C2]::${currentEmoji}::${commandText}::NONCE_VALID`).slice(0, 48) + '...';

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(`Discord Payload:\nChannel: #c2-relay (HTTPS/443)\nMessage: "${currentEmoji} [AES-GCM: ${pseudoCipher}]"\nIV: ${pseudoIv}\nTag: ${pseudoTag}`);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div className="card p-6 sm:p-8 border-sky-500/20 bg-gradient-to-b from-slate-900/90 to-slate-950">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold">
              Interactive Protocol Dissector · Stealth-C2 v1.0
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Discord HTTPS Steganography & AES-256-GCM Conduit
          </h3>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Real architectural model of how Haridev's Stealth-C2 tunnels encrypted operator instructions over the Discord API to bypass firewall egress controls.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <a
            href="https://github.com/haridevp/Stealth-C2"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <span>GitHub v1.0</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Interactive Command Picker */}
      <div className="my-6">
        <label className="block text-xs font-mono uppercase text-zinc-400 mb-2.5">
          Select Operator Instruction or Test Custom Input:
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {C2_COMMANDS.map((cmd) => {
            const isSelected = selectedCmd.name === cmd.name && !customInput;
            return (
              <button
                key={cmd.name}
                type="button"
                onClick={() => {
                  setSelectedCmd(cmd);
                  setCustomInput('');
                }}
                className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-sky-500/15 border-sky-400/50 text-sky-200 shadow-sm shadow-sky-500/10'
                    : 'bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]'
                }`}
              >
                <span className="text-base">{cmd.emoji}</span>
                <span>{cmd.name}</span>
              </button>
            );
          })}
        </div>

        {/* Custom command field */}
        <div className="relative">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Or type custom shell instruction (e.g. net user /domain, ipconfig /all)..."
            className="form-input text-xs font-mono pl-9 py-2 rounded-lg"
          />
          <Terminal size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          {customInput && (
            <button
              onClick={() => setCustomInput('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400 hover:text-white"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Dissection Pipeline Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-6">
        {/* Step 1: Operator Intent */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-2">
              <span>01. INGEST</span>
              <span className="text-sky-400 font-semibold">{currentEmoji}</span>
            </div>
            <div className="text-sm font-semibold text-white mb-1">
              Emoji Steganography
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              No plaintext strings. Commands are mapped to innocuous emojis within regular chat channels.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.06] text-xs font-mono text-zinc-300 bg-black/40 p-2 rounded">
            Cmd: <span className="text-emerald-400 font-semibold">{commandText}</span>
          </div>
        </div>

        {/* Step 2: Transport Egress */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-2">
              <span>02. TRANSPORT</span>
              <Lock size={13} className="text-amber-400" />
            </div>
            <div className="text-sm font-semibold text-white mb-1">
              Discord HTTPS (443)
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Blends with standard corporate outbound HTTPS web traffic; circumvents typical egress firewall rules.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.06] text-xs font-mono text-zinc-400 bg-black/40 p-2 rounded">
            Endpoint: <span className="text-zinc-200">api.discord.com:443</span>
          </div>
        </div>

        {/* Step 3: Cryptographic Frame */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-2">
              <span>03. CRYPTO</span>
              <Shield size={13} className="text-sky-400" />
            </div>
            <div className="text-sm font-semibold text-white mb-1">
              AES-256-GCM Envelope
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              96-bit random IV, client-side encryption, and 128-bit authentication tag prevent DLP inspection.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.06] text-xs font-mono text-zinc-400 bg-black/40 p-2 rounded truncate">
            Tag: <span className="text-sky-300">{pseudoTag.slice(0, 12)}...</span>
          </div>
        </div>

        {/* Step 4: Defense & Execution */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between transition-colors ${
          simulatedSandbox
            ? 'bg-red-950/20 border-red-500/40 text-red-100'
            : 'bg-slate-900/70 border-white/[0.08]'
        }`}>
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-2">
              <span>04. EXECUTION</span>
              {simulatedSandbox ? (
                <AlertTriangle size={13} className="text-red-400" />
              ) : (
                <CheckCircle2 size={13} className="text-emerald-400" />
              )}
            </div>
            <div className="text-sm font-semibold text-white mb-1">
              Anti-Analysis Guard
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Inspects process list for Wireshark, ProcMon, x64dbg, IDA, and Cuckoo sandboxes before execution.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={() => setSimulatedSandbox(!simulatedSandbox)}
              className={`w-full text-[11px] font-mono py-1 px-2 rounded border cursor-pointer transition-colors ${
                simulatedSandbox
                  ? 'bg-red-500/20 border-red-500/40 text-red-300'
                  : 'bg-white/[0.04] border-white/[0.08] text-zinc-400 hover:text-white'
              }`}
            >
              {simulatedSandbox ? '⚡ Sandbox Detected (Kill Switch Engaged)' : '🛡️ Simulate Sandbox Threat'}
            </button>
          </div>
        </div>
      </div>

      {/* Live Dissected Packet Inspector */}
      <div className="rounded-xl bg-black/60 border border-white/[0.08] p-4 font-mono text-xs overflow-hidden">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 text-zinc-400">
            <Radio size={14} className="text-sky-400 animate-pulse" />
            <span className="font-semibold text-zinc-200">Packet Dissection View</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-500 text-[11px]">MITRE ATT&CK TA0011 (Command and Control)</span>
          </div>
          <button
            type="button"
            onClick={handleCopyPayload}
            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {copiedPayload ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span>{copiedPayload ? 'Copied' : 'Copy Payload'}</span>
          </button>
        </div>

        {simulatedSandbox ? (
          <div className="p-4 rounded-lg bg-red-950/40 border border-red-500/30 text-red-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-red-300">
              <AlertTriangle size={15} />
              <span>KILL SWITCH TRIGGERED — DEFENSIVE EVASION ENGAGED</span>
            </div>
            <p className="text-xs text-red-300/80">
              Analysis artifact detected: <span className="font-semibold">"wireshark.exe" / "CuckooSandbox"</span> running in process environment.
            </p>
            <p className="text-xs font-mono text-red-400">
              [!] Aborting command execution. Overwriting key buffer in RAM with null bytes and invoking immediate exit code 0 to evade memory forensics.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5 text-zinc-300">
            <div className="text-zinc-500">// Outbound Discord REST API Frame</div>
            <div>
              <span className="text-purple-400">POST</span> <span className="text-emerald-400">/api/v10/channels/1319204859182/messages</span> <span className="text-zinc-500">HTTP/1.1</span>
            </div>
            <div>
              <span className="text-zinc-500">Host:</span> <span className="text-zinc-300">discord.com</span> · <span className="text-zinc-500">Content-Type:</span> application/json
            </div>
            <div className="pt-2 text-zinc-500">// AES-256-GCM Encrypted JSON Body</div>
            <div className="p-3 rounded bg-zinc-950/80 border border-white/[0.04] text-[11px] leading-relaxed">
              <span className="text-zinc-500">{"{"}</span><br />
              &nbsp;&nbsp;<span className="text-sky-300">"content"</span>: <span className="text-amber-300">"{currentEmoji}"</span>,<br />
              &nbsp;&nbsp;<span className="text-sky-300">"iv"</span>: <span className="text-emerald-300">"{pseudoIv}"</span>,<br />
              &nbsp;&nbsp;<span className="text-sky-300">"ciphertext"</span>: <span className="text-zinc-300">"{pseudoCipher}"</span>,<br />
              &nbsp;&nbsp;<span className="text-sky-300">"auth_tag"</span>: <span className="text-purple-300">"{pseudoTag}"</span><br />
              <span className="text-zinc-500">{"}"}</span>
            </div>
            <div className="pt-2 text-zinc-500">// Agent Decrypted Execution Output (on Target)</div>
            <div className="p-2.5 rounded bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 text-[11px] whitespace-pre-wrap">
              {customInput.trim()
                ? `[+] Executing: "${commandText}"\n[+] Output: Process exited normally (code 0). Results encrypted and routed to Discord webhook.`
                : selectedCmd.sampleOutput}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
