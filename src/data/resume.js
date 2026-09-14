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
      project: "CipherC2 (Confidential Lab Project)",
      details: [
        "Conducted offensive security research under Prof. Narayanaswamy N S and Dr. Jaimandeep Singh (Senior Consultant, ex-MoD); contributed to CipherC2, a confidential lab project modelling adversary C2 TTPs and initial access methodologies aligned with the MITRE ATT&CK framework.",
        "Applied Windows internals knowledge to research evasion strategies and initial access vectors for adversary emulation scenarios."
      ],
      tags: ["Adversary Simulation", "CipherC2", "Windows Internals", "MITRE ATT&CK", "C2 Infrastructure", "Evasion Strategies"]
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
      mitreTactic: "Defense & Cryptographic Verification",
      details: [
        "Built a 3-role RBAC networking platform with AES-256-GCM encryption via Web Crypto API (server stores only ciphertext and IV) and NIST SP 800-63-2 compliant auth – SHA-256 salted hashing, MFA (Email OTP), Level of Assurance 2.",
        "Enforced tamper-evident job referrals via SHA-256 digital signatures and end-to-end HTTPS; deployed live with frontend on GitHub Pages and backend on Render."
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
      category: "Offensive Security & Concepts",
      items: ["Penetration Testing", "Red Teaming", "C2 Infrastructure", "Active Directory Exploitation", "Adversary Emulation", "Post-Exploitation", "Privilege Escalation", "Network Enumeration", "Malware Analysis"]
    },
    {
      category: "Security Tools",
      items: ["Nmap", "Burp Suite", "Wireshark", "Impacket", "John the Ripper", "Metasploit", "BloodHound"]
    },
    {
      category: "Languages & Scripting",
      items: ["Python", "C++", "SQL", "Bash", "JavaScript", "HTML/CSS"]
    },
    {
      category: "Systems & Infrastructure",
      items: ["Linux (Kali, Fedora)", "Windows Server 2022", "Active Directory", "Docker", "Git"]
    },
    {
      category: "Platforms & Practice",
      items: ["TryHackMe (ArtemizZ – Top 30%)", "Hack The Box (Level 12 – 13 machines, Guided Tracks Tier 0–2)"]
    }
  ],
  certifications: [
    {
      name: "Google Cybersecurity Certificate",
      issuer: "Coursera",
      date: "Nov 2024",
      credentialUrl: "https://www.credly.com/badges/1aadb2c4-5166-4838-b412-8a212812a645",
      details: ["Comprehensive foundation across SIEM, packet analysis, intrusion detection, and incident response."]
    },
    {
      name: "TryHackMe – Advent of Cyber",
      issuer: "TryHackMe",
      date: "Dec 2025",
      credentialUrl: "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-H7HOUQW3FU.pdf",
      details: ["Offensive & defensive CTF exercises covering memory analysis, log forensics, web app exploits, and network enumeration."]
    }
  ]
};