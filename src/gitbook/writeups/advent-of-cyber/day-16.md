---
id: 16
title: Advent of Cyber 2025: Day 16
date: 2025-12-16
category: CTF
difficulty: Medium
readTime: 7 min
---

## Introduction 
Today's lab is about Registry Forensics
- Understand what the Windows Registry is and what it contains.
- Dive deep into Registry Hives and Root Keys.
- Analyze Registry Hives through the built-in Registry Editor tool.
- Learn Registry Forensics and investigate through the Registry Explorer tool.

## Walkthrough

Well the task is to find the details related to dispatch-srv01
inorder to find the application installed before the abnormal activity i checked the registry forensic table . as per the table the application related things are stored in software registry 
Well at first i tried manual way to check through it and find any thing related the app . but nothing was there . then i checked the uninstall folder 
>**DroneManager Updater**

and for the second qn to find the path where the user launched application . i check the registry table and found those data can be found in ntuser.dat

>**C:\Users\dispatch.admin\Downloads\DroneManager_Setup.exe**

and to get the location of any persisting application i went back to software registry again 
>**C:\Program Files\DroneManager\dronehelper.exe" --background**

*Note *: It took a long time to check through the directory to find the flag