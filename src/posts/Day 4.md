---
id: 4
title: AoC 2025 Day 4 - AI & SQLi
date: 2025-12-04
category: CTF
difficulty: Easy
readTime: 2 min
---


Day 4 was a bit different. Instead of manually hunting for bugs, we got to use an in-game AI chatbot called "Van Solit" to do the heavy lifting. The challenge covered the full lifecycle: finding a vulnerability, exploiting it, checking the logs, and then patching it.

### Recon & Exploitation
I started by asking the AI to scan the `login.php` file provided in the task. It immediately flagged a SQL Injection vulnerability.

Instead of writing a payload manually, I asked the bot to generate a Python exploit script. Running that script against the target IP bypassed the authentication instantly.

**Flag 1:**
`THM{SQLI_EXPLOIT}`

### Blue Teaming & Patching
After the attack, the room switched to defense. I fed the system logs back into the AI to see if it could detect what just happened. It successfully parsed the logs, identifying the attacker's IP and the malicious `1=1` payload.

**Flag 2:**
`THM{AI_MANIA}`