---
id: 2
title: CVE-2024-XXXX Analysis: Buffer Overflow
date: 2024-04-28
category: Research
difficulty: Critical
readTime: 20 min
---
### Overview

A detailed look at a stack-based buffer overflow in a popular FTP server utility.

### The Vulnerability

The vulnerable function `process_user_input()` uses `strcpy` without bounds checking.

```c
void process_user_input(char *input) {
    char buffer[64];
    strcpy(buffer, input); // Vulnerable!
}
```

By sending a payload larger than 64 bytes, we overwrite the EIP register.
