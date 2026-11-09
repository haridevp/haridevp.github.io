export const RESUME_DATA = {
  summary: "Offensive-security focused Computer Science student with hands-on experience in penetration testing, Active Directory exploitation, and red team operations. Passionate about adversary simulation, C2 infrastructure development, post-exploitation tradecraft, and building security tooling across network and infrastructure attack surfaces.",
  contact: {
    phone: "+91 7012705946",
    email: "haridevpnarayananivas@gmail.com",
    linkedin: "linkedin.com/in/haridevp",
    github: "github.com/haridevp",
    portfolio: "haridevp.dev",
    location: "Kozhikode, Kerala / Chennai, Tamil Nadu"
  },
  education: [
    {
      institution: "Amrita Vishwa Vidyapeetham, Coimbatore, Tamil Nadu",
      degree: "B.Tech in Computer Science and Engineering (CGPA: 7.1)",
      period: "Aug 2023 – Jul 2027",
      details: ["Focusing on Systems Security, Computer Networks, and Cryptography."]
    },
    {
      institution: "CKG Memorial HSS, Chingapuram, Kozhikode, Kerala",
      degree: "XII – 96%",
      period: "Jun 2021 – Mar 2023",
      details: ["Higher Secondary Education with distinction."]
    }
  ],
  experience: [
    {
      role: "Security Research Intern",
      organization: "ASTRA Lab (CyStar), IIT Madras",
      location: "Chennai, Tamil Nadu",
      period: "May 2026 – Present",
      current: true,
      mentors: "Prof. Narayanaswamy N S & Dr. Jaimandeep Singh (Senior Consultant, ex-MoD)",
      project: "Adversary Simulation & Windows Internals Evasion",
      details: [
        "Conducted offensive security research under Prof. Narayanaswamy N S and Dr. Jaimandeep Singh (Senior Consultant, ex-MoD), modeling adversary C2 TTPs and initial access methodologies aligned with the MITRE ATT&CK framework.",
        "Applied Windows internals knowledge to research evasion strategies and initial access vectors for adversary emulation scenarios."
      ],
      tags: ["Adversary Simulation", "Windows Internals", "MITRE ATT&CK", "C2 Infrastructure", "Evasion Strategies"]
    }
  ],
  talks: [
    {
      title: "Initial Access Vectors",
      event: "DeepTrustxAI Offensive Security Workshop, Session 2",
      audience: "Industry security professionals & law enforcement officials",
      period: "2026",
      details: [
        "Presented an in-depth technical session on Initial Access Vectors (IAV) and adversary tradecraft to an audience of industry security professionals and law enforcement officials."
      ],
      tags: ["Initial Access (IAV)", "Adversary Tradecraft", "Red Team Emulation", "Law Enforcement Briefing"]
    }
  ],
  projects: [
    {
      title: "Stealth C2 Framework",
      tech: "Python, Discord API, AES-256-GCM",
      period: "Nov 2025 – Jan 2026",
      link: "https://github.com/haridevp/Stealth-C2",
      releaseLink: "https://github.com/haridevp/Stealth-C2/releases/tag/v1.0",
      status: "v1.0 Release",
      badge: "v1.0 Release",
      category: "offsec",
      mitreTactic: "Command & Control (TA0011)",
      details: [
        "Built a modular red team C2 framework tunnelling AES-256-GCM encrypted traffic over the Discord API to blend with legitimate HTTPS traffic and bypass firewall egress restrictions.",
        "Implemented emoji-based steganographic command protocol mapping 7 operator commands (RCE, exfiltration, surveillance, persistence) to innocuous chat messages; integrated anti-forensic detection across 5 analysis tools (Wireshark, ProcMon, Cuckoo) with automated kill switch."
      ]
    },
    {
      title: "Enterprise Active Directory Attack Lab",
      tech: "Windows Server 2022, PowerShell, Impacket",
      period: "Nov 2025 – Dec 2025",
      link: "https://github.com/haridevp/Enterprise-AD-Attack-Lab",
      status: "Lab Simulation",
      badge: "Attack Simulation",
      category: "offsec",
      mitreTactic: "Privilege Escalation & Lateral Movement",
      details: [
        "Built a 4-machine virtual enterprise environment (Windows Server 2022 DC, 2 Windows 11 workstations, Kali attacker) simulating a real-world corporate network for adversary simulation.",
        "Executed a full red team attack chain – LLMNR poisoning, Kerberoasting, SMB relay, Pass-the-Hash, and privilege escalation – achieving Domain Admin access while bypassing Windows Defender default configurations."
      ]
    },
    {
      title: "AI Automated Pentesting Framework",
      tech: "FastAPI, Celery, ChromaDB, LangChain, PostgreSQL",
      period: "Jan 2026 – Present",
      link: "https://github.com/haridevp/AI-Automated-Pentesting-Framework",
      status: "Active R&D",
      badge: "Conference Track 2026",
      category: "offsec",
      mitreTactic: "Recon & Weaponization (TA0043/TA0001)",
      details: [
        "Building a RAG-based pentesting assistant (team of 4) that retrieves contextual CVE data and attack patterns to generate adaptive, behaviour-driven engagement plans against live targets.",
        "Implementing LLM-driven behavioural analysis of target system responses to dynamically adjust attack strategies mid-engagement; targeting conference publication 2026."
      ]
    },
    {
      title: "Alumni Connect",
      tech: "Node.js, MongoDB, Web Crypto API",
      period: "Jan 2026 – Feb 2026",
      link: "https://github.com/haridevp/Alumini_Connect",
      liveLink: "https://haridevp.dev/Alumini_Connect/",
      status: "Live Platform",
      badge: "Cryptographic Architecture",
      category: "offsec",
      mitreTactic: "Defense & Cryptographic Verification",
      details: [
        "Built a 3-role RBAC networking platform with AES-256-GCM encryption via Web Crypto API (server stores only ciphertext and IV) and NIST SP 800-63-2 compliant auth – SHA-256 salted hashing, MFA (Email OTP), Level of Assurance 2.",
        "Enforced tamper-evident job referrals via SHA-256 digital signatures and end-to-end HTTPS; deployed live with frontend on GitHub Pages and backend on Render."
      ]
    },
    {
      title: "CollabCanvas — Real-Time Collaborative Canvas",
      tech: "React, Node.js, Socket.io, Fabric.js, MongoDB",
      period: "2025",
      link: "https://github.com/haridevp/CollabCanvas",
      status: "Open Source",
      badge: "6 GitHub Stars",
      category: "systems",
      mitreTactic: "Real-Time Systems & WebSockets",
      details: [
        "Engineered an infinite collaborative digital canvas supporting multi-user simultaneous drawing with live mouse cursor tracking, room-based private sessions, and sub-50ms WebSocket state synchronization.",
        "Implemented a comprehensive layer management system (reordering, locking, hiding), JWT-authenticated user management, and client-side vector export (PNG/SVG)."
      ]
    },
    {
      title: "Distributed Key-Value Store",
      tech: "Go, net/rpc, Docker, JSON Engine",
      period: "2025",
      link: "https://github.com/haridevp/distributed-kv-project",
      status: "Architecture Prototype",
      badge: "Go Systems",
      category: "systems",
      mitreTactic: "Distributed Systems & RPC",
      details: [
        "Built a distributed key-value storage engine in Go utilizing standard net/rpc for high-throughput inter-node remote procedure calls.",
        "Designed peer-to-peer replication across a multi-node cluster with broadcast protocols, disk-backed JSON persistence, and automated multi-container LAN simulations."
      ]
    },
    {
      title: "Blockchain Consensus Explorer",
      tech: "React, Vite, Tailwind CSS, Recharts",
      period: "2025",
      link: "https://github.com/haridevp/consensus-explorer",
      status: "Interactive Tool",
      badge: "Consensus Analysis",
      category: "systems",
      mitreTactic: "Cryptographic Consensus",
      details: [
        "Developed an interactive analytical dashboard modeling and comparing 8 blockchain consensus mechanisms (PoW, PoS, DPoS, PBFT, Raft, Paxos, PoA) across security resilience, trilemma metrics, and fault tolerance.",
        "Architected a data-driven model mapping real-world L1/L2 networks with dynamic visual radar charts and trilemma trade-off evaluations."
      ]
    }
  ],
  publications: [
    {
      title: "Lane Change Prediction & Obstacle Avoidance in Autonomous Vehicles Using Rainbow DQN",
      publisher: "SCRS CIMA 2026, NIT Puducherry (Springer LNNS, Scopus-indexed) – Accepted & Presented",
      status: "Accepted & Presented",
      role: "Corresponding Author",
      details: [
        "Haridev P (corresponding-author) – “An Adaptive Framework for Lane Change Prediction and Obstacle Avoidance in Autonomous Vehicles Using Rainbow DQN,” SCRS CIMA 2026, NIT Puducherry (Springer LNNS, Scopus-indexed) – Accepted & Presented."
      ]
    }
  ],
  skills: [
    {
      category: "Offensive Security & Red Teaming",
      items: [
        "Active Directory Exploitation",
        "Command & Control (C2) Architecture",
        "Adversary Emulation (MITRE ATT&CK)",
        "Kerberoasting & AS-REP Roasting",
        "LLMNR/NBT-NS Poisoning",
        "Pass-the-Hash & SMB Relay",
        "DCSync & BloodHound Auditing",
        "Post-Exploitation Tradecraft",
        "Anti-Analysis & Sandbox Evasion",
        "Malware Analysis Fundamentals"
      ]
    },
    {
      category: "Security & Penetration Testing Tools",
      items: [
        "Impacket Suite",
        "Burp Suite Professional",
        "BloodHound",
        "Nmap",
        "Wireshark",
        "Metasploit Framework",
        "Responder",
        "John the Ripper / Hashcat",
        "Mimikatz"
      ]
    },
    {
      category: "Systems & Programming Languages",
      items: [
        "Python (Offensive Tooling)",
        "C++ (Systems Programming)",
        "Go (net/rpc & Distributed Systems)",
        "Bash & PowerShell Scripting",
        "SQL (PostgreSQL)",
        "JavaScript / TypeScript",
        "HTML/CSS & React"
      ]
    },
    {
      category: "Operating Systems & Infrastructure",
      items: [
        "Kali Linux & Fedora Linux",
        "Windows Server 2022 (Domain Services)",
        "Active Directory Lab Topology",
        "Docker & Containerization",
        "Git & CI/CD",
        "ChromaDB & Celery"
      ]
    }
  ],
  platforms: [
    {
      name: "TryHackMe",
      handle: "ArtemizZ",
      stat: "24 Writeups Documented",
      profileUrl: "https://tryhackme.com/p/ArtemizZ",
      highlight: "24-Day Advent of Cyber Series Completed"
    },
    {
      name: "Hack The Box",
      handle: "haridevp",
      stat: "Level 12 • 13 Boxes",
      profileUrl: "https://app.hackthebox.com",
      highlight: "Level 12 · 13 Boxes"
    }
  ],
  certifications: [
    {
      name: "Google Cybersecurity Professional Certificate",
      issuer: "Coursera / Google",
      date: "Nov 2024",
      credentialUrl: "https://www.credly.com/badges/1aadb2c4-5166-4838-b412-8a212812a645",
      details: ["Comprehensive foundation across SIEM, packet analysis, intrusion detection, and incident response."]
    },
    {
      name: "Advent of Cyber 2025 Certificate",
      issuer: "TryHackMe",
      date: "Dec 2025",
      credentialUrl: "https://tryhackme.com/p/ArtemizZ",
      details: ["24 days of hands-on security challenges covering Web, Reverse Engineering, Forensics, and AD."]
    },
    {
      name: "Google Cloud Computing Foundations",
      issuer: "Google Cloud / Credly",
      date: "2023",
      credentialUrl: "https://www.credly.com/badges/e9868959-964f-4194-b640-77d4b54ac790/",
      details: ["Cloud infrastructure, networking, identity management, and security fundamentals."]
    },
    {
      name: "Google Cloud Skills Boost",
      issuer: "Google Developers",
      date: "Active",
      credentialUrl: "https://www.cloudskillsboost.google/public_profiles/85843ac3-3173-4aa4-85bc-5e02126aa3cb",
      details: ["Demonstrated competency in cloud architecture and security modules."]
    }
  ]
};