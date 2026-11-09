# Privilege Escalation Playbooks

Checklists and scripts for escalating local privileges on Linux and Windows systems.

---

### Linux Privilege Escalation

#### 1. Sudo Rights
```bash
sudo -l
# Check GTFOBins for any binaries listed in sudo -l
```

#### 2. SUID / SGID Binaries
```bash
# Find SUID binaries
find / -perm -u=s -type f 2>/dev/null

# Find GUID binaries
find / -perm -g=s -type f 2>/dev/null
```

#### 3. Cron Jobs & Writable Paths
```bash
cat /etc/crontab
ls -la /etc/cron.*
find / -writable -type d 2>/dev/null | grep -v "/proc" | grep -v "/sys"
```

---

### Windows Privilege Escalation

#### 1. Token Privileges
```powershell
whoami /priv
# Look for SeImpersonatePrivilege (JuicyPotatoNG, GodPotato, PrintSpoofer)
# Look for SeBackupPrivilege / SeRestorePrivilege
```

#### 2. Unquoted Service Paths
```powershell
wmic service get name,displayname,pathname,startmode | findstr /i "auto" | findstr /i /v "c:\windows\\" | findstr /i /v """
```

#### 3. AlwaysInstallElevated Registry Keys
```powershell
reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
# If both return 0x1, generating an MSI payload with msfvenom will execute as SYSTEM
```
