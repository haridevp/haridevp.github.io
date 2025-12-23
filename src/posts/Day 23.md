---
id: 23
title: Advent of Cyber 2025: Day 23
date: 2025-12-23
category: CTF
difficulty: Easy
readTime: 7 min
---

## Introduction
Today's box is about :
- Learn the basics of AWS accounts.
- Enumerate the privileges granted to an account, from an attacker's perspective.
- Familiarise  with the AWS CLI.

## Walkthrough

Well to begin with i have to retrieve the user information 
for that there was already file configured with user credentials
so i ran `aws sts get-caller-identity`
Account number
>**123456789012**

>**Policy**

Inorder to find the policy assigned for SirCarrotbane 
`aws iam list-user-policies --user-name sir.carrotbane`
>**SirCarrotbanePolicy**

Apart from GetObject and ListBucket he can take action on
>**ListAllMyBuckets**

And after changing the user to temporary user . in the bucket there was one file called clous_passwords.txt . downloading and viewing it will give the last flag of this box
>**THM{more_like_sir_cloudbane}**


