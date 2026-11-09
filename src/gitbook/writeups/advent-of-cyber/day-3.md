---
id: 3
title: AoC 2025 Day 3: Splunk Basics
date: 2025-12-03
category: CTF
difficulty: Easy
readTime: 5 min
---

# Log Analysis with Splunk

Day 3 focused on using Splunk to investigate a compromise on the Wareville network. We had to dig through Windows logs to analyze an RDP brute-force attack.

## Flags Found

**1. Target IP**
Identified the specific machine involved in the incident.
> **Flag:** `198.51.100.55`

**2. Failed RDP Attempts**
Filtered for Event ID 4625 to count how many times the attacker tried and failed to authenticate.
> **Flag:** `993`

**3. Specific Event Count**
Narrowed down the search to a specific successful event ID to trace the attacker's steps.
> **Flag:** `658`

**4. Total Event Volume**
Ran a basic count on the index to capture the full scope of logs generated during the window.
> **Flag:** `126167`
