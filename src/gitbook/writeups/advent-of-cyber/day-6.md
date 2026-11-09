---
id: 6
title: Advent of Cyber 2025 - Day 6
date: 2025-12-06
category: CTF
difficulty: Medium
readTime: 10 min
---

## Overview

For Day 6, I was tasked with analyzing a piece of malware found on a compromised Windows machine. The goal was to perform static analysis to identify indicators of compromise (IOCs), find hidden data within the binary, and determine how the malware maintains persistence on the system.

## Investigation & Analysis

### 1. Identifying the Malware
To start the investigation, I needed to generate a unique fingerprint for the suspicious file. By running a checksum on the executable, I obtained the SHA-256 hash, which is essential for cross-referencing with threat intelligence databases like VirusTotal.

> **File Hash (SHA-256):** `F29C270068F865EF4A747E2683BFA07667BF64E768B38FBB9A2750A3D879CA33`

### 2. Extracting Hidden Strings
I performed basic static analysis using a strings utility to look for human-readable text embedded inside the binary. Amidst the code and libraries, I located a specific string that served as the flag for this step.

> **Flag:** `THM{STRINGS_FOUND}`

### 3. Detecting Persistence Mechanisms
Malware often modifies the Windows Registry to ensure it executes automatically when the system boots or a user logs in. I examined the Registry hives and found a suspicious entry under the `Run` key for a specific user SID. This key pointed to an executable named "HopHelper".

**Registry Key Path:**
```text
HKU\S-1-5-21-1966530601-3185510712-10604624-1008\Software\Microsoft\Windows\CurrentVersion\Run\HopHelper
```

### 4. C2 Protocol

Finally, I analyzed the network artifacts to determine how the malware communicates with its Command & Control server. The analysis revealed that the malware is configured to communicate over an unencrypted web protocol.

> **Flag:** `http`