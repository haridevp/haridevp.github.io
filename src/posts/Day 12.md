---
id: 12
title: Advent of Cyber 2025: Day 12
date: 2025-12-12
category: CTF
difficulty: Medium
readTime: 15 min
---

## Introduction
This lab is about :-
- Spotting phishing emails
- Learn trending phishing techniques
- Understand the differences between spam and phishing

## Walkthrough

I need to categorize 6 different emails to spam and phishing 
### Email 1
it might look like easy task but not as i dig in the first  email it look like spam from a single glance but the headers say a whole diff story. even though the from address and preview look nothing suspicious 
in the headers **authentication result , spf=fail** and also **dkm=fail** and **dmarc=fail** which means the sender is not in the list of people and couldnt verify the signature 

> So i confirmed that this is phishing email that contains sense of urgency , fake invoice and spoofing

>**Flag** `THM{yougotnumber1-keep-it-going}`
### Email 2
This email also has legitimate from  address  but then when i checked the attachment i noticed that file name is 
![[Pasted image 20251212230237.png]]

ends with `.html` format and not .mp3 but in the name they have given .mp3 to confuse the end user 
and also in the headers **authentication result , spf=fail** and also **dkm=fail** and **dmarc=fail** which means the sender is not in the list of people and couldnt verify the signature 

> So i confirmed that this is phishing email that contains Impersonation, Malicious Attachment and spoofing

>**Flag** `THM{nmumber2-was-not-tha-thard!}`

### Email 3
This email from address is sketchy also the body of the email . no attachment and i passed the email security filters 
in the content the attacker is trying to change the communication channel . this is a basic example of Social engineering,

> So i confirmed that this is phishing email that contains Impersonation, Sense of urgency and Social engineering text

>**Flag** `THM{Impersonation-is-areal-thing-keepIt}`

### Email 4
This email asking the user to go to a legitimate link of dropbox and the from address is of an external domain 

> So i confirmed that this is phishing email that contains Impersonation, External Sender Domain and Social engineering text

>**Flag** `THM{Get-back-SOC-mas!!}`

### Email 5
It doesnt contain anything as suspicious and it even passed the email filters 
>so this is a spam 

>**Flag** `THM{It-was-just-a-sp4m!!}`

### Email 6
well this was a easy spot as the sender email address contains a latin word 
![[Pasted image 20251212232138.png]]

> So i confirmed that this is phishing email that contains Impersonation, Typosquatting/Punycodesand Social engineering text

>**Flag** `THM{number6-is-the-last-one!-DX!}`

