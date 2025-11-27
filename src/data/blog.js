export const BLOG_POSTS = [
  {
    id: 1,
    title: "Breaking the Bank: HTB 'Heist' Writeup",
    date: "2024-05-12",
    category: "HackTheBox",
    difficulty: "Hard",
    readTime: "15 min",
    content: '### Executive Summary\n\nThis machine involved a complex chain of vulnerabilities starting with a misconfigured SMB share leading to a Windows support panel exploit.\n\n### Phase 1: Reconnaissance\n\nI started with a standard Nmap scan to identify open ports.\n\n```bash\nnmap -sC -sV -oA scans/initial 10.10.10.x\n```\n\nThe scan revealed port 80 (HTTP) and 445 (SMB) were open. Enumerating SMB shares without credentials proved successful.\n\n### Phase 2: Exploitation\n\nFound a "config.php" backup file on the SMB share containing database credentials.'
  },
  {
    id: 2,
    title: "CVE-2024-XXXX Analysis: Buffer Overflow",
    date: "2024-04-28",
    category: "Research",
    difficulty: "Critical",
    readTime: "20 min",
    content: '### Overview\n\nA detailed look at a stack-based buffer overflow in a popular FTP server utility.\n\n### The Vulnerability\n\nThe vulnerable function `process_user_input()` uses `strcpy` without bounds checking.\n\n```c\nvoid process_user_input(char *input) {\n    char buffer[64];\n    strcpy(buffer, input); // Vulnerable!\n}\n```\n\nBy sending a payload larger than 64 bytes, we overwrite the EIP register.'
  },
  {
    id: 3,
    title: "Intro to Privilege Escalation on Linux",
    date: "2024-03-15",
    category: "Tutorial",
    difficulty: "Medium",
    readTime: "10 min",
    content: 'Content placeholder for Linux PrivEsc tutorial...'
  }
];
