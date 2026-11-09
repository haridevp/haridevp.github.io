# 🔬 CipherC2: ASTRA Lab Research Initiative

> **Research Group**: ASTRA Lab (CyStar), Indian Institute of Technology Madras (IITM)  
> **Faculty Advisor**: Prof. Narayanaswamy N S  
> **Industry Mentor**: Dr. Jaimandeep Singh (Senior Consultant, ex-Ministry of Defence)  
> **Researcher**: Haridev P

---

### Research Background & Motivation

Enterprise red teaming has historically relied on commercially available or open-source adversary simulation frameworks (e.g., Cobalt Strike, Mythic, Sliver). Because these frameworks are widely known, modern Endpoint Detection and Response (EDR) platforms and Network Detection and Response (NDR) sensors have developed static and behavioral signatures specifically targeting their default staging beacons, named pipe conventions, and thread injection patterns.

The **CipherC2** research project at ASTRA Lab investigates:
1. **Adversary TTP Modeling**: Systematically reconstructing real-world nation-state threat actor tradecraft as defined by the MITRE ATT&CK framework.
2. **Next-Generation Egress Channels**: Analyzing unconventional egress pathways (DNS-over-HTTPS, QUIC, WebSocket multiplexing, and SaaS API relays) to assess network perimeter resilience.
3. **Behavioral In-Memory Telemetry**: Examining how Windows kernel sensors (ETW, kernel callbacks, Minifilter drivers) capture process injection and reflective DLL loading in memory.

---

### Core Research Areas

```text
[CipherC2 Architecture Research]
         ├── Layer 1: Transport Resilience (Multiplexed WebSockets & QUIC)
         ├── Layer 2: Evasion Subsystems (AMSI/ETW In-Memory Hook Defeat)
         ├── Layer 3: Payload Delivery (Direct Syscalls & Indirect Syscalls)
         └── Layer 4: Telemetry Correlation (Evaluating Sysmon & SIEM Detection Limits)
```

#### 1. Direct & Indirect Syscalls
Modern EDR solutions place user-mode hooks (`jmp` instructions) inside `ntdll.dll` to monitor sensitive API calls such as `NtAllocateVirtualMemory`, `NtWriteVirtualMemory`, and `NtCreateThreadEx`. 

CipherC2 evaluates techniques to bypass user-mode hooks by dynamically determining the System Service Number (SSN) from disk or memory, and executing the `syscall` assembly instruction directly, evading user-mode hook redirection.

#### 2. Process Ghosting & Herpaderping
Investigating techniques that modify file payloads after creation but before execution, preventing antivirus file scanners from inspecting the executable binary before it enters memory.

#### 3. Egress Telemetry Stress-Testing
Simulating multi-stage data exfiltration over encrypted SaaS pipes to test whether enterprise Security Operations Centers (SOCs) can detect covert exfiltration purely via traffic metadata and flow statistics when deep packet inspection is blind.
