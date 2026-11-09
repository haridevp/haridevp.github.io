---
id: 2
title: AoC Day 2: Phishing for Passwords
date: 2025-12-02
category: TryHackMe
difficulty: Easy
readTime: 5 min
---

### overview
Completed Day 2 of Advent of Cyber 2025. Today's task, "Mary Clickmas," focused on **Social Engineering**. We joined the Red Team to simulate a phishing campaign against staff members.

### the task
The goal was to harvest credentials from a specific user (`factory@wareville.thm`) using a fake login page, then use those credentials to access their email and find a hidden production value.

### tools used
* **Social Engineering Toolkit (SET):** For the mass mailer attack.
* **Python:** To host the malicious `server.py` on port 8000.

### the process
1.  **Setup:** Spun up the malicious server to host the fake "Best Festival Company" portal.
2.  **Phish:** Used `setoolkit` (Option 1 -> 5) to send a spoofed email from "Flying Deer" claiming an urgent shipping schedule change.
3.  **Harvest:** The victim clicked the link, sending their credentials to our terminal.
4.  **Access:** Logged into the victim's RoundCube webmail to find the secret production email.

### flags captured
* **Flag 1 (Harvested Password):** `unranked-wisdom-anthem`
* **Flag 2 (Units Requested):** `1984000`