# 🔍 Defense Evasion & Windows Internals

Defense evasion encompasses the techniques adversaries use to avoid detection throughout their compromise lifecycle. In modern Windows enterprise environments, this means understanding how security controls monitor system behavior and operating beneath their telemetry thresholds.

---

### EDR Detection Architecture: User-Mode vs Kernel-Mode

```text
[User-Space Application]
          │
          ▼  Calls VirtualAllocEx / WriteProcessMemory
[kernel32.dll / KernelBase.dll]
          │
          ▼  Calls NtAllocateVirtualMemory
[ntdll.dll (USER-MODE HOOKS)] <========== [EDR Sensor DLL injected into every process]
          │                                (Inspects arguments; sends telemetry to agent)
          ▼  Syscall 0x18
============================================= KERNEL BOUNDARY
[Windows Kernel (ntoskrnl.exe)]
          ├── Kernel Callbacks (PsSetCreateProcessNotifyRoutine, ObRegisterCallbacks)
          ├── Minifilter File System Driver (Monitors I/O)
          └── Event Tracing for Windows (ETW / Microsoft-Windows-Threat-Intelligence)
```

---

### Key Evasion Concepts

#### 1. User-Mode Hooking & API Bypasses
Security products (such as CrowdStrike Falcon, SentinelOne, Microsoft Defender for Endpoint) inject a proprietary DLL (e.g. `atc.dll`, `eViewer.dll`) into every new user-mode process. This DLL overwrites the first few instructions of critical functions in `ntdll.dll` with a `jmp` instruction pointing to the EDR's inspection logic.

*Evasion Countermeasures:*
* **Direct Syscalls**: Resolving the System Service Number (SSN) dynamically and issuing the `syscall` instruction directly in assembly, skipping the hooked `ntdll.dll` function prelude entirely.
* **DLL Unhooking**: Reading a fresh, unhooked copy of the `.text` section of `ntdll.dll` from disk (`\KnownDlls\ntdll.dll` or `C:\Windows\System32\ntdll.dll`) and overwriting the hooked memory section in the running process.

#### 2. Event Tracing for Windows (ETW) Patching
ETW logs security events directly from userland and kernel providers to consumer listeners. Many modern AMSI and memory-scanning features rely on the `Microsoft-Windows-Threat-Intelligence` and `Microsoft-Windows-DotNETRuntime` providers.

Patching `EtwEventWrite` in memory by writing a simple `ret` (`0xC3`) instruction disables user-mode ETW event generation for the process without crashing the thread.

#### 3. Call Stack Spoofing
EDRs inspect the call stack when sensitive APIs are invoked. If a thread calls `NtAllocateVirtualMemory` with execution permissions from an unbacked memory region (memory not associated with a valid PE file on disk), the EDR flags this as reflective injection. 

Call stack spoofing involves rewriting the return addresses on the stack to simulate execution originating from legitimate system DLLs (e.g., `kernel32.dll!BaseThreadInitThunk`).
