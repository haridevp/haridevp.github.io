# 👤 About Me | Haridev P

```text
========================================================================================
[+] OPERATOR:     Haridev P
[+] ROLE:         Security Research Intern & Offensive Engineering Specialist
[+] APPOINTMENT:  ASTRA Lab (CyStar), Indian Institute of Technology Madras (IITM)
[+] ADVISORS:     Prof. Narayanaswamy N S & Dr. Jaimandeep Singh (Senior Consultant, ex-MoD)
[+] LAB FOCUS:    Adversary Emulation · Covert C2 · Windows Internals · Evasion
========================================================================================
```

---

### Introduction & Focus

I am a Computer Science engineer and offensive security specialist based in India. My work centers on adversary simulation, Active Directory exploitation chains, and designing covert Command & Control infrastructures that evade modern enterprise telemetry.

At **ASTRA Lab (CyStar), IIT Madras**, my research centers on adversary simulation, analyzing adversary tactics, techniques, and procedures (TTPs) mapped to the MITRE ATT&CK framework, with a specific focus on Windows internals evasion, in-memory execution, and covert network egress channels.

---

### 🛡️ Core Technical Competencies

| Domain | Key Tools & Tradecraft |
| :--- | :--- |
| **Active Directory Exploitation** | Kerberoasting, AS-REP Roasting, Pass-the-Hash (PtH), Pass-the-Ticket (PtT), DCSync, AD CS (ESC1–ESC8), BloodHound / SharpHound attack graph analysis, ACL & GPO abuse. |
| **Covert C2 Architecture** | Custom C2 agents in Python & C++, SaaS egress steganography (Discord / Slack API), AES-256-GCM framing, dynamic beacon jitter, process anti-analysis safeguards. |
| **Windows Internals & Evasion** | AMSI/ETW memory patching, process injection (APC Queue, Remote Thread, Hollow), token impersonation (`SeImpersonatePrivilege`), Named Pipe communications. |
| **Network Pivoting & Relaying** | Chisel SOCKS5 reverse proxies, Ligolo-ng TUN interfaces, SSH dynamic port forwarding, Windows `netsh interface portproxy`, NTLMv2 relaying with Responder & ntlmrelayx. |
| **Systems & Tool Development** | Python, C/C++, Go (Distributed Systems & net/rpc), Bash, PowerShell, Docker, Linux system internals. |

---

### 🚀 Key Projects & Offensive Implementations

#### 1. Stealth-C2 Framework (v1.0)
* **Repository**: [github.com/haridevp/Stealth-C2](https://github.com/haridevp/Stealth-C2)
* **Architecture**: A modular red team Command & Control conduit utilizing the Discord REST API (HTTPS/443) for command dispatch and encrypted exfiltration.
* **Cryptography**: Authenticated AES-256-GCM encryption with 96-bit initialization vectors and 128-bit authentication tags.
* **Steganography & Evasion**: Operator commands mapped to chat emojis; integrated sandbox survey module that checks for Wireshark, ProcMon, and x64dbg before execution.

#### 2. Enterprise Active Directory Attack Lab
* **Repository**: [github.com/haridevp/Enterprise-AD-Attack-Lab](https://github.com/haridevp/Enterprise-AD-Attack-Lab)
* **Architecture**: 4-machine virtual enterprise network (Windows Server 2022 DC, 2 Windows 11 workstations, Kali Linux attacker machine).
* **Kill Chain Modeled**: LLMNR multicast poisoning $\rightarrow$ Kerberoasting service SPNs $\rightarrow$ Pass-the-Hash via WMI $\rightarrow$ DCSync replication to achieve full Domain Admin persistence.

#### 3. Distributed Key-Value Store in Go
* **Repository**: [github.com/haridevp/distributed-kv-project](https://github.com/haridevp/distributed-kv-project)
* **Architecture**: High-throughput distributed storage engine in Go utilizing standard `net/rpc`, write-ahead logging (WAL), and JSON persistence across multi-node Docker clusters.

#### 4. CollabCanvas
* **Repository**: [github.com/haridevp/CollabCanvas](https://github.com/haridevp/CollabCanvas)
* **Architecture**: Real-time collaborative digital canvas with WebSocket state synchronization, JWT auth, and vector export.

---

### 📄 Peer-Reviewed Academic Research

* **Conference Proceedings (Springer LNNS / Scopus-Indexed)**:
  * **Title**: *"An Adaptive Framework for Lane Change Prediction and Obstacle Avoidance in Autonomous Vehicles Using Rainbow DQN"*
  * **Role**: Corresponding Author
  * **Venue**: SCRS Conference on Communication, Information and Measurement Applications (CIMA 2026), hosted by National Institute of Technology Puducherry (NIT Puducherry).
  * **Indexing**: Springer Lecture Notes in Networks and Systems (LNNS).

---

### 🏆 Verified Security Handles

* **TryHackMe**: [`ArtemizZ`](https://tryhackme.com/p/ArtemizZ) — **24 Writeups Documented**
  * Completed and documented all 24 days of Advent of Cyber 2025.
* **Hack The Box**: [`Level 12`](https://app.hackthebox.com/profile/1381393) — **Level 12 · 13 Boxes**
  * 13 rooted boxes across Linux and Windows enterprise paths.
* **Google Developers**: [Haridev P Developer Profile](https://g.dev/haridevp)

---

### 🔑 PGP Public Key & Secure Communications

For confidential coordination, encrypted communications, and security disclosures:

```text
-----BEGIN PGP PUBLIC KEY BLOCK-----
Comment: Haridev P (ASTRA Lab, IIT Madras) <haridevpnarayananivas@gmail.com>
Fingerprint: 4A82 9D2A 7B03 E61C 82D4 195F C3A0 B782 5E11 D42B

mQGNBF/xxxx... [PGP Public Key for haridevpnarayananivas@gmail.com]
-----END PGP PUBLIC KEY BLOCK-----
```

---

### 📬 Connect

* **Portfolio & Labs**: [haridevp.dev](https://haridevp.dev)
* **GitBook**: [haridev.gitbook.io/haridev](https://haridev.gitbook.io/haridev/)
* **GitHub**: [github.com/haridevp](https://github.com/haridevp)
* **LinkedIn**: [linkedin.com/in/haridevp](https://linkedin.com/in/haridevp)
* **Email**: `haridevpnarayananivas@gmail.com`
