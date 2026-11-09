---
id: 5
title: Advent of Cyber 2025 - Day 5
date: 2025-12-06
category: TryHackMe
difficulty: Easy
readTime: 5 min
---

# Santa's Little IDOR

**Topic:** Web Security (IDOR)
**Tools:** Browser DevTools, Online UUID Tool

**Summary:**
Today's challenge was a great intro to Insecure Direct Object References (IDOR). I managed to access other users' accounts just by tweaking the `user_id` in the Browser DevTools—no fancy tools needed, just basic network inspection.

I also picked up the distinction between the two main types of IDOR:
* **Horizontal IDOR:** This is what I did in the lab—moving "sideways" to access data of other users who have the same permission level as me.
* **Vertical IDOR:** This happens when you move "up" the chain, accessing admin-level data or functions with a standard user account.
