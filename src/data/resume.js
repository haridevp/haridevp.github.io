export const RESUME_DATA = {
  summary: "Offensive-security focused Computer Science student with hands-on experience in penetration testing, Active Directory exploitation, and red team operations. Passionate about adversary simulation, vulnerability research, and building security tooling across web, network, and infrastructure attack surfaces.",
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
      tech: "Python, Discord API, AES-256",
      period: "Nov 2025 - Jan 2026",
      link: "https://github.com/haridevp/Stealth-C2-Framework",
      details: [
        "Developed a modular C2 framework using AES-256-GCM encrypted communication tunnelled over legitimate Discord API traffic to bypass firewall restrictions.",
        "Implemented emoji-based steganographic protocols to disguise C2 commands as innocuous chat messages, reducing traffic anomaly signatures.",
        "Designed cross-platform persistence via user-level systemd (Linux) and startup folder injection (Windows) without requiring elevated privileges."
      ]
    },
    {
      title: "Enterprise Active Directory Attack Lab",
      tech: "Windows Server, PowerShell, Impacket",
      period: "Nov 2025 - Dec 2025",
      link: "https://github.com/haridevp/Enterprise-AD-Attack-Lab",
      details: [
        "Designed and deployed a virtual enterprise AD environment simulating a real-world corporate network with Windows Server 2022 and Windows 11 endpoints.",
        "Executed a full attack chain including LLMNR poisoning, Kerberoasting, SMB relay, Pass-the-Hash, and privilege escalation to Domain Admin.",
        "Applied defensive hardening countermeasures using Group Policy Objects (GPO), LAPS, and event log auditing to understand detection and mitigation."
      ]
    },
    {
      title: "AI Automated Pentesting Framework",
      tech: "Python, RAG, LLM (In Development)",
      period: "Jan 2026 - Present",
      link: "https://github.com/haridevp/AI-Automated-Pentesting-Framework",
      details: [
        "Building a RAG-based penetration testing assistant that retrieves contextual attack patterns and CVE data to generate adaptive, behaviour-driven pentest plans.",
        "Implementing behavioural analysis of target system responses to dynamically adjust attack strategies during an engagement; targeting conference publication 2026."
      ]
    },
    {
      title: "Alumni Connect",
      tech: "Node.js, MongoDB, Web Crypto API",
      period: "Jan 2026 - Feb 2026",
      link: "https://github.com/haridevp/Alumni-Connect",
      details: [
        "Built a role-based networking platform implementing AES-256-GCM encryption via the Web Crypto API — server stores only ciphertext and IV.",
        "Implemented NIST SP 800-63-2 compliant authentication with SHA-256 salted hashing and MFA (Email OTP), achieving Level of Assurance 2.",
        "Designed RBAC with tamper-evident job referrals via SHA-256 digital signatures; deployed with HTTPS enforced end-to-end."
      ]
    }
  ],
  publications: [
    {
      title: "Lane Change Prediction & Obstacle Avoidance in Autonomous Vehicles Using Rainbow DQN",
      publisher: "SCRS CIMA 2026, NIT Puducherry (Springer LNNS, Scopus-indexed) – Under Review",
      details: [
        "Haridev P (co-author) – “An Adaptive Framework for Lane Change Prediction and Obstacle Avoidance in Autonomous Vehicles Using Rainbow DQN”"
      ]
    }
  ],
  skills: [
    { category: "Languages", items: ["Python", "C++", "SQL", "HTML/CSS", "JavaScript", "Bash"] },
    { category: "Security Tools", items: ["Nmap", "Burp Suite", "Wireshark", "Impacket", "John the Ripper", "Metasploit", "BloodHound"] },
    { category: "Systems", items: ["Linux (Kali, Fedora)", "Windows Server", "Active Directory"] },
    { category: "Concepts", items: ["Penetration Testing", "C2 Infrastructure", "AD Exploitation", "Malware Analysis", "Red Team Tradecraft"] },
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