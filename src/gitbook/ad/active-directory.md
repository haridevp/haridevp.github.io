# Active Directory Exploitation

Active Directory (AD) serves as the centralized identity provider and access control backbone for enterprise Windows networks. Securing or auditing AD environments requires understanding how trust relationships, authentication protocols (Kerberos, NTLM), and permissions interconnect.

---

### Key Concepts

* **Domain Controller (DC)**: The central server that stores domain data, manages directory services, and handles authentication (Kerberos KDC).
* **Kerberos Authentication**: Ticket-based mutual authentication protocol replacing legacy NTLM. Relies heavily on TGT (Ticket Granting Ticket) and TGS (Ticket Granting Service).
* **Access Control Lists (ACLs / ACEs)**: Granular permission sets determining who can modify user accounts, reset passwords, change group memberships, or execute remote commands.

---

### Attack Methodology Overview

1. **Reconnaissance & Enumeration**:
   * Discovering Domain Controllers, domain users, groups, and SPNs.
   * Graphing attack relationships using SharpHound / BloodHound.
2. **Initial Credential Access**:
   * AS-REP Roasting (pre-auth disabled accounts).
   * Kerberoasting (requesting service tickets for offline hash extraction).
3. **Privilege Escalation**:
   * Exploiting misconfigured ACLs (`GenericAll`, `WriteDacl`, `ForceChangePassword`).
   * Group policy object (GPO) abuse.
4. **Lateral Movement**:
   * Pass-the-Hash (PtH) via SMB/WMI.
   * Overpass-the-Hash (PtK) requesting Kerberos tickets.
   * Token impersonation.
5. **Domain Dominance**:
   * DCSync (`DS-Replication-Get-Changes-All` rights).
   * Golden Ticket & Silver Ticket generation.
