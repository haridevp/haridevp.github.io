---
id: 20
title: Advent of Cyber 2025: Day 20
date: 2025-12-20
category: CTF
difficulty: Easy
readTime: 5 min
---

## Introduction
Today's box is about :
- Understand what race conditions are and how they can affect web applications.
- Learn how to identify and exploit race conditions in web requests.
- How concurrent requests can manipulate stock or transaction values.
- Explore simple mitigation techniques to prevent race condition vulnerabilities.

## Walkthrough
Well to begin with i had to setup the attack box firefox with burpsuit 
which is done by adding froxypoxy so we can use it later and make our device as localhost (depends upon our setup in froxypoxy) and check the burp traffic and modify accordingly 

Then with the given login credentials login in the website while burp running background 
and inorder to demonstrate race condition we send one request packet from the history to the repeater and make multiple copy of that and send **parallel** .
Which caused the website a bug 

>**THM{WINNER_OF_R@CE007}**


>**THM{WINNER_OF_Bunny_R@ce}**
