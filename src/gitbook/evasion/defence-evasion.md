# Defence Evasion & Windows Internals

Defence evasion consists of techniques used by adversaries to avoid detection throughout their compromise lifecycle.

---

### Key Evasion Concepts

#### 1. Process Injection (T1055)
Executing arbitrary code in the address space of a separate, legitimate running process to mask malicious activity and inherit permissions.
* **Classic DLL Injection**: Using `VirtualAllocEx`, `WriteProcessMemory`, and `CreateRemoteThread`.
* **Process Hollowing**: Spawning a legitimate process in a suspended state (`CREATE_SUSPENDED`), unmapping its original executable section (`NtUnmapViewOfSection`), and replacing it with malicious code before resuming the thread.

---

#### 2. AMSI (Antimalware Scan Interface) Bypass
AMSI allows Windows applications (like PowerShell or WScript) to pass scripts to an antivirus engine before execution. Common evasion methods involve patching in-memory functions:

* **AMSI Patching**: Locating `amsi.dll!AmsiScanBuffer` in memory and overwriting the beginning instructions with an immediate return (`RET`) or error code so all scans return clean (`AMSI_RESULT_NOT_DETECTED`).

---

#### 3. Direct System Calls
Bypassing user-mode EDR hooks placed in `ntdll.dll` by querying system service numbers (SSNs) and issuing `syscall` instructions directly from assembly routines.
