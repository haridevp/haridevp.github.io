# 📦 Hack The Box Methodology & Root Walkthroughs

> **Platform**: [Hack The Box Profile](https://app.hackthebox.com/profile/1381393)  
> **Handle**: `Level 12` · 13 Boxes Rooted  
> **Specialization**: Linux internals, Windows Active Directory, service enumeration

---

### Standard Operating Methodology

```text
[1. Service Discovery & Port Scan]
         │
         ▼  nmap -sS -p- --min-rate 2500 -T4
[2. Vulnerability Assessment & Service Probing]
         ├── Web: ffuf, feroxbuster, Burp Suite (Check source, robots.txt, cookies)
         ├── SMB: NetExec, smbclient, enum4linux-ng (Null sessions, guest access)
         └── RPC / SNMP / Database: rpcclient, snmpwalk, mssqlclient
         │
         ▼  Identify Vulnerability / CVE / Default Credential
[3. Initial Foothold & Reverse Shell]
         ├── TTY Upgrade: python3 -c 'import pty; pty.spawn("/bin/bash")'
         └── Session Persistence: Drop SSH authorized_key
         │
         ▼  LinPEAS / WinPEAS / Manual Enumeration
[4. Privilege Escalation to Root / SYSTEM]
         ├── Linux: Sudo rights, SUID, Capabilities, Crontabs, Kernel
         └── Windows: SeImpersonate, Unquoted paths, LAPS, AD delegation
```

---

### Machine Progression & Categories

#### 1. Linux Exploitation Archetypes
* **Web Footholds**: SQL Injection (SQLi) into file upload, Command Injection, Server-Side Template Injection (SSTI in Jinja2 / Twig), Server-Side Request Forgery (SSRF) reaching cloud metadata (`http://169.254.169.254/`).
* **Privilege Escalation**:
  * Abusing Sudo rules with GTFOBins (`sudo npm`, `sudo tar`, `sudo fail2ban`).
  * SUID path-hijacking on custom compiled C wrappers.
  * Exploiting internal microservices bound to `127.0.0.1` via SSH port forwarding.

#### 2. Windows & Active Directory Archetypes
* **Active Directory Chains**:
  * Discovering plaintext passwords in web application configuration files (`web.config`, `wp-config.php`).
  * Using compromised domain user to request Kerberoastable service tickets (`GetUserSPNs.py`).
  * Extracting NTLM hashes from memory or SAM using Impacket.
  * Leveraging BloodHound to identify ACL paths leading to `Domain Admins`.
