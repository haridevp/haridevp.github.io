# ⚡ Adversary Emulation & C2 Architecture

Adversary emulation tests an enterprise's defensive posture by executing realistic attacks mapped directly to known threat actor Tactics, Techniques, and Procedures (TTPs). Central to any red team operation is the **Command & Control (C2)** infrastructure.

---

### MITRE ATT&CK C2 Matrix (TA0011)

```text
+-------------------+-----------------------------------------------------------------+
| ATT&CK Technique  | Red Team Implementation & Tradecraft                            |
+-------------------+-----------------------------------------------------------------+
| T1071.001 (Web)   | Outbound HTTPS beaconing disguised as routine cloud web traffic |
| T1071.004 (DNS)   | DNS tunneling via base64 encoded TXT and A-record subdomains    |
| T1001 (Obfuscate) | Steganographic embedding of commands within images or emojis    |
| T1573.002 (Asymm) | Hybrid cryptography: ECDH key exchange + AES-256-GCM symmetric   |
| T1027 (Obfuscated)| In-memory reflective DLL loading; API unhooking before execution |
+-------------------+-----------------------------------------------------------------+
```

---

### Beaconing Mathematics & Egress Jitter

Predictable beaconing intervals (e.g. contacting a C2 server exactly every 60 seconds) are easily detected by network anomaly detection systems and SIEM correlation rules using Fourier analysis and autocorrelation.

To break periodic detection, modern C2 agents introduce randomized **jitter**:

$$\text{Next Sleep Time} = T_{\text{base}} \times \left(1 + \frac{\text{rand}(-J, +J)}{100}\right)$$

Where $T_{\text{base}}$ is the base sleep duration (e.g., 60 seconds) and $J$ is the jitter percentage (e.g., 25%). The agent sleeps for any duration between 45 and 75 seconds, destroying periodic frequency spikes in network telemetry.

```python
import random
import time

def calculate_sleep(base_seconds: int = 60, jitter_pct: int = 25) -> float:
    delta = base_seconds * (jitter_pct / 100.0)
    sleep_duration = random.uniform(base_seconds - delta, base_seconds + delta)
    return max(1.0, sleep_duration)

# Execution loop
# sleep_time = calculate_sleep(60, 30)
# time.sleep(sleep_time)
```

---

### Egress Filtering Evasion Strategies

1. **Reputable Cloud SaaS Conduits**: Tunneling instructions through trusted third-party APIs (Discord, Slack, Notion, Telegram, GitHub). Egress firewalls see outbound traffic destined for legitimate IPs owned by Cloudflare or Microsoft with verified TLS certificates.
2. **Domain Fronting & CDN Egress**: Directing traffic to an innocuous domain hosted on a Content Delivery Network (CDN) while specifying the attacker's origin server in the HTTP `Host` header.
3. **MIME-Type Masquerading**: Formatting all exfiltration data as multi-part image attachments (`image/png`, `image/webp`) or JSON API webhooks to blend with background application telemetry.
