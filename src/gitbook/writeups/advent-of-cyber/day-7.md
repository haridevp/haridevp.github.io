---
id: 7
title: Advent of Cyber 2025: Day 7
date: 2025-12-07
category: CTF
difficulty: Medium
readTime: 2 min
---

## Introduction

Not in the mood to write a massive blog post today, but Day 7 was actually pretty fun. We had to do some network discovery to kick some bunnies out of a server.

Here is the quick breakdown.

## Day 7: Scanner Claus

The goal was to find three hidden key fragments scattered across different ports to unlock an admin console.

* **Key 1:** Found on FTP (Port 21212) -> `3aster_`
* **Key 2:** Found on a custom service (Port 25251) -> `15_th3_`
* **Key 3:** Found via DNS (UDP Port 53) -> `n3w_xm45`

**The Passphrase:**
Combined them to get: `3aster_15_th3_n3w_xm45`

**The Flag:**
Once inside, I dumped the database and got the final flag:

`THM{4ll_s3rvice5_d1sc0vered}`
