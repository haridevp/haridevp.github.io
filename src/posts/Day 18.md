---
id: 18
title: Advent of Cyber 2025: Day 18
date: 2025-12-18
category: CTF
difficulty: Medium
readTime: 3 min
---

## Introduction
Today's Box is about 
- Learn about obfuscation, why and where it is used.
- Learn the difference between encoding, encryption, and obfuscation.
- Learn about obfuscation and the common techniques.
- Use CyberChef to recover plaintext safely.

## Walkthrough

Well in the given machine there exist a file called `SantaStealer` this file contains all the encoded or encrypted code for each flag . 

first given value was `$C2B64 = "aHR0cHM6Ly9jMi5ub3J0aHBvbGUudGhtL2V4Zmls"

Well checking left side of the value its easy to understand that this is encoded with Base64 
using CodeChef to find the C2 link
`https://c2.northpole.thm/exfil`

now updating this link in the code and running to get the file 
> **THM{C2_De0bfuscation_29838}**

now onto the second one
`$ApiKey = "CANDY-CANE-API-KEY"
`$ObfAPIKEY = Invoke-XorDecode -Hex "<HEX_HERE>" -Key 0x37`

from this code we can understand the API key is encoded with XOR  to Hex with a key 0x37
using CyberChef again
 
>**THM{API_Obfusc4tion_ftw_0283}**

