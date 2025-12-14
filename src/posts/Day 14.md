---
id: 14
title: Advent of Cyber 2025: Day 14
date: 2025-12-14
category: CTF
difficulty: Medium
readTime: 5 min
---

## Introduction
Today's lab is about containers . the challenge is to investigate the Docker layers and restore the defaced Hopperoo website to its original service

## Walkthrough 
Inorder to see the which services are running . 
```
docker ps
```

in those one particular one i checked which is uptime-checker `docker exec -it uptime-checker sh`  in this docker i checked for a docker escape attack. inorder to check i ran `docker ps` inside the docker which gave me the original list . which means i can perform docker escape attack in this 

well my second try was to the deployer container as it has root privilege 
And from here i tried running `ls` well it showed nothing then i tried `ls -la ` it showed two users which have root privilege
so i switched to root user `sudo su` 
Yesss i am in the root directory . now main concern is to find the hidden flag so checked through the directory and nothing was found so i came to previous dir usring `cd .. `
tadaa there it is the flag.txt
>**THM{DOCKER_ESCAPE_SUCCESS}**

well for the bonus qn i navigated to the wareville website 
> **DeployMaster2025!**
