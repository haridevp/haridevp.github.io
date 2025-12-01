---
id: 1
title: Advent of Cyber 2025 - Day 1 Walkthrough
date: 2025-12-01
category: TryHackMe
difficulty: Easy
readTime: 5 min
---

# Advent of Cyber 2025 - Day 1

## Introduction & Scenario

The event begins in Wareville, where McSkidy has gone missing. The defenses are failing, and we need to investigate a Linux server that processes Christmas wish lists to find traces of what happened.

## Learning Objectives

- Basic Linux command line navigation (ls, cd, cat).
    
- Finding hidden files and directories.
    
- Searching logs using grep.
    
- Privilege escalation and bash history analysis.
    

## Tools Used

- AttackBox (Terminal)
    
- Commands: `ls`, `cat`, `cd`, `grep`, `find`, `history`
    

## Walkthrough

### Task 1: The Guide (Hidden File)

The first step was to look for clues left by McSkidy. I started by listing the files in the home directory.

1. List files to see the `guides` directory.
    
    ```
    ls
    ```
    
2. Navigate into the directory.
    
    ```
    cd Guides
    ```
    
3. Use the `-la` flag to reveal hidden files (files starting with a dot).
    
    ```
    ls -la
    ```
    
4. Read the hidden guide file to find the first flag.
    
    ```
    cat .guide.txt
    ```
    

### Task 2: Log Analysis

The guide hinted at checking logs for suspicious activity.

1. Navigate to the log directory.
    
    ```
    cd /var/log
    ```
    
2. Use `grep` to search for failed login attempts in the `auth.log` file.
    
    ```
    grep "failed password" auth.log
    ```
    

### Task 3: The Malicious Script

I needed to find a suspicious file related to "eggs" (Easter eggs or malicious payloads).

1. Use the `find` command to search for files containing "egg" in the name.
    
    ```
    find /home/socmas -name *egg*
    ```
    
1. The search revealed a script named `eggstrike.sh`. I navigated to its location (likely `/home/socmas/2025/eggstrike.sh`) and read it to find the second flag.
    
    ```
    cat /home/socmas/2025/eggstrike.sh
    ```
    

### Task 4: Root History

The final step involved checking what the attacker did as the root user.

1. Switch to the root user.
    
    ```
    sudo su
    ```
    
2. Check the command history for the root user to find the final flag left by the attacker.
    
    ```
    history
    ```
    

## Solution & Flags

| Question                                                   | Answer/Flag                    |
| ---------------------------------------------------------- | ------------------------------ |
| What command to list a directory?                          | `ls`                           |
| What command to search for text in a file?                 | `grep`                         |
| What flag did you find in McSkidy's guide?                 | _THM{learning-linux-cli}_      |
| What flag did you see inside the eggstrike.sh script?      | _THM{sir-carrotbane-attacker}_ |
| What flag did the attacker leave in the root bash history? | _THM{until-meet-again}_        |

## Conclusion

Day 1 provided a quick refresher on essential Linux commands. By exploring hidden files, searching logs with grep, and inspecting bash history, we were able to uncover the initial traces of the attack.