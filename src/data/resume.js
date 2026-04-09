export const RESUME_DATA = {
  summary: null,
  contact: {
    phone: "7012705946",
    email: "haridevpnarayananivas@gmail.com",
    linkedin: "linkedin.com/in/haridevp",
    github: "github.com/haridevp",
    portfolio: "haridevp.dev"
  },
  education: [
    {
      institution: "Amrita Vishwa Vidyapeetham, Coimbatore, Tamil Nadu",
      degree: "B.Tech in Computer Science and Engineering (CGPA: 7.0)",
      period: "Aug 2023 - Jul 2027",
      details: []
    },
    {
      institution: "CKG Memorial HSS, Chingapuram, Kozhikode, Kerala",
      degree: "XII - 96%",
      period: "Jun 2021 - Mar 2023",
      details: []
    }
  ],
  experience: [],
  projects: [
    {
      title: "Stealth C2 Framework",
      tech: "Python, Discord API, AES-256-GCM",
      period: "Nov 2025 - Jan 2026",
      link: "https://github.com/haridevp/Stealth-C2",
      details: [
        "Built a modular red team C2 framework tunnelling AES-256-GCM encrypted traffic over the Discord API to blend with legitimate HTTPS traffic and bypass firewall egress restrictions.",
        "Implemented emoji-based steganographic command protocol mapping 7 operator commands (RCE, exfiltration, surveillance, persistence) to innocuous chat messages; integrated anti-forensic detection across 5 analysis tools (Wireshark, ProcMon, Cuckoo) with automated kill switch."
      ]
    },
    {
      title: "Enterprise Active Directory Attack Lab",
      tech: "Windows Server 2022, PowerShell, Impacket",
      period: "Nov 2025 - Dec 2025",
      link: "https://github.com/haridevp/Enterprise-AD-Attack-Lab",
      details: [
        "Built a 4-machine virtual enterprise environment (Windows Server 2022 DC, 2 Windows 11 workstations, Kali attacker) simulating a real-world corporate network for adversary simulation.",
        "Executed a full red team attack chain – LLMNR poisoning, Kerberoasting, SMB relay, Pass-the-Hash, and privilege escalation – achieving Domain Admin access while bypassing Windows Defender default configurations."
      ]
    },
    {
      title: "AI Automated Pentesting Framework",
      tech: "FastAPI, Celery, ChromaDB, LangChain, PostgreSQL",
      period: "Jan 2026 - Present",
      link: "https://github.com/haridevp/AI-Automated-Pentesting-Framework",
      details: [
        "Building a RAG-based pentesting assistant (team of 4) that retrieves contextual CVE data and attack patterns to generate adaptive, behaviour-driven engagement plans against live targets.",
        "Implementing LLM-driven behavioural analysis of target system responses to dynamically adjust attack strategies mid-engagement; targeting conference publication 2026."
      ]
    },
    {
      title: "Alumni Connect",
      tech: "Node.js, MongoDB, Web Crypto API",
      period: "Jan 2026 - Feb 2026",
      link: "https://github.com/haridevp/Alumini_Connect",
      liveLink: "https://haridevp.dev/Alumini_Connect/",
      details: [
        "Built a 3-role RBAC networking platform with AES-256-GCM encryption via Web Crypto API (server stores only ciphertext and IV) and NIST SP 800-63-2 compliant auth – SHA-256 salted hashing, MFA (Email OTP), Level of Assurance 2.",
        "Enforced tamper-evident job referrals via SHA-256 digital signatures and end-to-end HTTPS; deployed live with frontend on GitHub Pages and backend on Render."
      ]
    }
  ],
  publications: [
    {
      title: "Lane Change Prediction & Obstacle Avoidance in Autonomous Vehicles Using Rainbow DQN",
      publisher: "SCRS CIMA 2026, NIT Puducherry (Springer LNNS, Scopus-indexed) – Accepted",
      details: [
        "Haridev P (co-author) \u2013 \"An Adaptive Framework for Lane Change Prediction and Obstacle Avoidance in Autonomous Vehicles Using Rainbow DQN,\" SCRS CIMA 2026, NIT Puducherry (Springer LNNS, Scopus-indexed) \u2013 Accepted."
      ]
    }
  ],
  skills: [
    { category: "Languages", items: ["Python", "C++", "SQL", "HTML/CSS", "JavaScript", "Bash"] },
    { category: "Security Tools", items: ["Nmap", "Burp Suite", "Wireshark", "Impacket", "John the Ripper", "Metasploit", "BloodHound"] },
    { category: "Systems", items: ["Linux (Kali, Fedora)", "Windows Server", "Active Directory"] },
    { category: "Concepts", items: ["Penetration Testing", "Red Teaming", "C2 Infrastructure", "Post-Exploitation", "Privilege Escalation", "Network Enumeration", "AD Exploitation", "Malware Analysis"] },
    { category: "Developer Tools", items: ["Git", "Docker"] },
    { category: "Platforms", items: ["TryHackMe (ArtemizZ)", "Hack The Box"] }
  ],
  certifications: [
    {
      name: "Google Cybersecurity Certificate",
      issuer: "Coursera",
      date: "Nov 2024",
      details: []
    },
    {
      name: "TryHackMe – Advent of Cyber",
      issuer: "TryHackMe",
      date: "Dec 2025",
      details: []
    }
  ]
};