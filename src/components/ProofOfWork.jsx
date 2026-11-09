import React from 'react';
import {
  Award, Shield, ExternalLink, BookOpen, CheckCircle2,
  Terminal, Globe, Cpu, Mic, FileText, Check
} from 'lucide-react';
import { USER_CONFIG } from '../data/config';
import { RESUME_DATA } from '../data/resume';

export default function ProofOfWork() {
  return (
    <div className="space-y-6">
      {/* Platform & Practical OffSec Proof Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* TryHackMe Profile */}
        <div className="card p-5 border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 via-slate-900/40 to-slate-950 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="tag text-xs text-emerald-400 border-emerald-500/30 bg-emerald-500/10 font-mono">
                TryHackMe · ArtemizZ
              </span>
              <a
                href={USER_CONFIG.thmProfile}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-zinc-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>Verify Profile</span>
                <ExternalLink size={12} />
              </a>
            </div>
            <h4 className="text-lg font-bold text-white mb-1">
              24 Writeups Documented
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed mb-4">
              Active practitioner on TryHackMe. Successfully solved and documented all 24 days of the Advent of Cyber 2025 challenge series covering Linux forensics, reverse engineering, web exploitation, and Active Directory paths.
            </p>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>24 Documented Writeups</span>
            <span className="text-emerald-400 font-semibold">Advent of Cyber Credential ✓</span>
          </div>
        </div>

        {/* Hack The Box Profile */}
        <div className="card p-5 border-sky-500/20 bg-gradient-to-br from-sky-950/20 via-slate-900/40 to-slate-950 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="tag text-xs text-sky-400 border-sky-500/30 bg-sky-500/10 font-mono">
                Hack The Box · Level 12
              </span>
              <a
                href={USER_CONFIG.htbProfile}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-zinc-400 hover:text-sky-300 flex items-center gap-1"
              >
                <span>HTB Platform</span>
                <ExternalLink size={12} />
              </a>
            </div>
            <h4 className="text-lg font-bold text-white mb-1">
              Level 12 · 13 Boxes
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed mb-4">
              Hands-on lab exploitation across Linux and Windows systems spanning network enumeration, privilege escalation vectors, binary inspection, and initial foothold acquisition.
            </p>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Level 12 · 13 Boxes</span>
            <span className="text-sky-400 font-semibold">Active OffSec Lab Work ✓</span>
          </div>
        </div>
      </div>

      {/* Workshop Speaker & Peer-Reviewed Research Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* DeepTrustxAI Workshop Session */}
        <div className="card p-5 border-purple-500/20 bg-gradient-to-br from-purple-950/20 via-slate-900/40 to-slate-950 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="tag text-xs text-purple-300 border-purple-500/30 bg-purple-500/10 font-mono">
                Workshop Speaker · 2026
              </span>
              <span className="text-xs font-mono text-zinc-500">Law Enforcement Briefing</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white mb-1">
              Initial Access Vectors (IAV)
            </h4>
            <p className="text-xs text-purple-200/70 font-mono mb-2">
              DeepTrustxAI Offensive Security Workshop, Session 2
            </p>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Delivered an in-depth technical training session on Initial Access Vectors (IAV), adversary emulation methodologies, and perimeter evasion to an audience of industry cybersecurity practitioners and law enforcement officers.
            </p>
          </div>

          <div className="pt-3 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Audience: SecOps & Law Enforcement</span>
            <span className="text-purple-300">Technical Briefing ✓</span>
          </div>
        </div>

        {/* Springer Scopus Publication */}
        <div className="card p-5 border-amber-500/20 bg-gradient-to-br from-amber-950/20 via-slate-900/40 to-slate-950 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="tag text-xs text-amber-300 border-amber-500/30 bg-amber-500/10 font-mono">
                Springer LNNS · Scopus
              </span>
              <span className="text-xs font-mono text-zinc-500">Corresponding Author</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white mb-1">
              Rainbow DQN Autonomous Navigation
            </h4>
            <p className="text-xs text-amber-200/70 font-mono mb-2">
              SCRS CIMA 2026, NIT Puducherry
            </p>
            <p className="text-xs text-zinc-300 leading-relaxed">
              “An Adaptive Framework for Lane Change Prediction and Obstacle Avoidance in Autonomous Vehicles Using Rainbow DQN.” Accepted and presented in peer-reviewed conference proceedings.
            </p>
          </div>

          <div className="pt-3 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>NIT Puducherry Conference</span>
            <span className="text-amber-300">Accepted & Presented ✓</span>
          </div>
        </div>
      </div>

      {/* Verified Certifications Bar */}
      <div className="card p-5">
        <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
          Verified Industry Credentials
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {RESUME_DATA.certifications.map((cert, idx) => (
            <a
              key={idx}
              href={cert.credentialUrl}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-zinc-500 transition-colors flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">{cert.date}</span>
                  <ExternalLink size={12} className="text-zinc-500 group-hover:text-white transition-colors" />
                </div>
                <div className="text-xs font-semibold text-white group-hover:text-sky-300 transition-colors leading-snug">
                  {cert.name}
                </div>
              </div>
              <div className="text-[11px] font-mono text-zinc-400 mt-2">
                {cert.issuer}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
