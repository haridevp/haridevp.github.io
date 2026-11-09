# Adversary Emulation & Command & Control (C2)

Adversary emulation is the discipline of testing cyber defenses by mimicking the documented Tactics, Techniques, and Procedures (TTPs) of real-world Advanced Persistent Threats (APTs).

---

### Command & Control (C2) Infrastructure

C2 infrastructure provides an operator with an encrypted channel to direct compromised endpoints. In enterprise red team engagements, traditional raw TCP reverse shells or unencrypted HTTP beacons are trivially caught by:

1. **Next-Generation Firewalls (NGFW)**: Blocking non-standard ports or egress destinations.
2. **TLS Inspection / Deep Packet Inspection (DPI)**: Flagging self-signed certificates or anomalous HTTP headers.
3. **Behavioral Endpoint Detection (EDR)**: Flagging anomalous parent-child process trees (e.g., `cmd.exe` spawned under Microsoft Word).

---

### Modern Covert Egress Strategies

* **SaaS API Conduits**: Tunneling communications through legitimate enterprise services like Discord, Slack, GitHub, or Microsoft Graph APIs.
* **DNS Tunneling**: Slow, low-bandwidth data exfiltration disguised as recursive DNS lookups.
* **Domain Fronting & Cloudflare Workers**: Routing traffic through trusted high-reputation CDN domains.
