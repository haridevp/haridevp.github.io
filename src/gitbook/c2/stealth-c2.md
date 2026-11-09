# Stealth C2 Framework Architecture

> Research & development notes on the [Stealth-C2](https://github.com/haridevp/Stealth-C2) project by **Haridev P**.

---

### Architecture Overview

Stealth-C2 was built to evaluate corporate network egress monitoring by using legitimate cloud SaaS endpoints as the primary beaconing backplane.

```text
[Compromised Endpoint]
         │
         ▼  (HTTPS 443 — Discord REST API)
[Discord Gateway CDN]
         │
         ▼  (Operator Channel)
[Red Team Operator Console]
```

---

### Core Engineering Highlights

#### 1. Discord API Egress Conduit
* All beaconing and command traffic passes through `https://discord.com/api/v10/`.
* Inherits trusted TLS certificates and high domain reputation, bypassing traditional destination-based URL filters and outbound proxy blocks.

#### 2. AES-256-GCM End-to-End Cryptography
* Payloads are encrypted using authenticated **AES-256-GCM**.
* Each communication frame includes a fresh 12-byte initialization vector (IV) and a 16-byte authentication tag to prevent replay attacks and tampering.

#### 3. Command Steganography
* Operator commands and responses are mapped to standard chat emojis and unobtrusive message strings to prevent heuristic content filtering inside chat channels.

#### 4. Automated Defensive Kill-Switch
* Before executing high-privilege operations, the agent surveys active processes.
* If common dynamic analysis tools (Wireshark, Process Hacker, x64dbg, ProcMon) are detected, the payload zeroes its memory buffers and self-terminates silently.
