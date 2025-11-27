---
id: 1
title: Breaking the Bank: HTB 'Heist' Writeup
date: 2024-05-12
category: HackTheBox
difficulty: Hard
readTime: 15 min
---
### Executive Summary

This machine involved a complex chain of vulnerabilities starting with a misconfigured SMB share leading to a Windows support panel exploit.

### Phase 1: Reconnaissance

I started with a standard Nmap scan to identify open ports.

```bash
nmap -sC -sV -oA scans/initial 10.10.10.x
```

The scan revealed port 80 (HTTP) and 445 (SMB) were open. Enumerating SMB shares without credentials proved successful.

### Phase 2: Exploitation

Found a "config.php" backup file on the SMB share containing database credentials.
