---
id: 11
title: Advent of Cyber 2025: Day 11
date: 2025-12-11
category: CTF
difficulty: Easy
readTime: 3 min
---

## Introduction 

Well Today is XSS ( Cross-Site Scripting). 
there are 3 diff type of XSS

### 1,Reflected XSS
this reflects the injection immediately in the url bar 

### 2, Stored XSS
this save the script in sever and then execute or load to every user who views or access

### 3, DOM based
if the data is stored in client side we can use xss to get or modify it 

## Walkthrough

Well for this lab **Stored** XSS attacks are required
in the message sending box i tried 
```
<script>alert('cat flag.txt')</script>
```

tadaa the website returned the flag as response 

>**THM{Evil_Stored_Egg}**

and for the reflected XSS i used the same command as Stored one 
>**THM{Evil_Bunny}**

*Np the above commands are not really used in real world in this case the website returned the flag as soon as it detected xss attempt*

