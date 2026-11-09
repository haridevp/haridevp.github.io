---
id: 19
title: Advent of Cyber 2025: Day 19
date: 2025-12-19
category: CTF
difficulty: Medium
readTime: 10 min
---

## Introduction 
Today's Box is about 
- How **SCADA (Supervisory Control and Data Acquisition)** systems monitor industrial processes
- What **PLCs (Programmable Logic Controllers)** do in automation
- How the **Modbus protocol** enables communication between industrial devices
- How to identify compromised system configurations in industrial systems
- Techniques for safely remediating compromised control systems
- Understanding protection mechanisms and trap logic in ICS environments

## Walkthrough
Common Port used by Modbus Tcp
>**502**

Well inorder to check the open ports and service version i ran
`nmap -sV -p 22,80,502 10.49.147.177`
*Note : in this i mentioned specific ports to reduce scanning time*

result 
`PORT    STATE SERVICE VERSION
`22/tcp  open  ssh     OpenSSH 9.6p1 Ubuntu 3ubuntu13.11 (Ubuntu Linux; protocol 2.0)
`80/tcp  open  http    Werkzeug/3.1.3 Python/3.12.3
`502/tcp open  mbap?`
`
From the result i know that there is http open so i checked it 
Well it was the CCTV footage

Time to create a custom reconnaissance 
`nano reconnaissance.py`

*Note : the code was given by Tryhackme*

Well as per the crumbled paper we got the order are changed so the system is under the control king malhare 

we need to change some orders in the current system to make it normal 
for that i created a remediation script
`nano restore_christmas.py`

*Note : the code was given by Tryhackme*

then i ran it `python3 restore_christmas.py`

which changed the system to normal 

> **Flag: THM{eGgMas0V3r}**

