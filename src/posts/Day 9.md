---
id: 9
title: Advent of Cyber 2025: Day 9 
date: 2025-12-09
category: CTF
difficulty: Easy
readTime: 5 min
---

## Introduction

well today is about attacks against **Encrypted files**  and how password based encyption protects password etc ..

## Walkthrough

well in the Desktop folder there were two files named flag.zip and flag.pdf . the goal is to crack the hidden flags inside it

### cracking pdf 
I used pdfcrack to get the user password 
```
pdfcrack -f flag.pdf -w /usr/share/wordlists/rockyou.txt
```

well after running this i got the user password 
>naughtylist

using this to open the file ..

tada i got the first flag
> **Flag** `THM{Cr4ck1ng_PDFs_1s_34$y}`

### cracking zip
well inorder to crack zip the most suitable tool would be john . For john to run we need the hash of the file 

```
zip2john flag.zip > flag.txt
```

now we can run john against the hash file to crack the password . like last time . this time also i am using rockyou.txt

```
john --wordlist=/usr/share/wordlists/rockyou.txt flag.txt
```

i got the password `winter4ever`

using the password to access zip 

> **Flag** `THM{Cr4ck1n6_z1p$_1s_34$yyyy}`