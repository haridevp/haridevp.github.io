---
id: 13
title: Advent of Cyber 2025: Day 13
date: 2025-12-13
category: CTF
difficulty: Medium
readTime: 10 min
---

## Introduction
Well today is room is about YARA . It is a tool built to identify and classify malware by searching for unique patterns, the digital fingerprints left behind by attackers

## Walkthrough
well the task is simple we need to create our own custom yara rule to find the malware .

so i created a new file named test.yar
```
nano test.yar
```

and i pasted the given code by tryhackme . And tweaked according to the requirement 

well while creating the rule one of the major was to create a regex that can check the string starting with TBFC: followed by one or more alphanumeric ascii characters 

> **/TBFC:[A-Za-z0-9]+/**

```test.yar
rule test
{
    meta:
        author = "ArtemizZ"
        description = "IcedID Rule"
        date = "2025-12-13"
        confidence = "low"

    strings:
        $key = /TBFC:[A-Za-z0-9]+/ ascii
    condition:
        $key
}

```

i ran this custom file of mine
```
yara -rs /home/ubuntu/test.yar /home/ubuntu/Downloads/easter

```

and the results i got is 
```
test /home/ubuntu/Downloads/easter/easter46.jpg
0x2f78a:$key: TBFC:HopSec
test /home/ubuntu/Downloads/easter/easter16.jpg
0x3bb7f7:$key: TBFC:me
test /home/ubuntu/Downloads/easter/easter10.jpg
0x137da8:$key: TBFC:Find
test /home/ubuntu/Downloads/easter/easter52.jpg
0x2a2ad2:$key: TBFC:Island
test /home/ubuntu/Downloads/easter/easter25.jpg
0x42c778:$key: TBFC:in

```

>there are **5** images that contain the string TBFC:

And one thing to notice from the above outpput is that there are jumbled words like hopsec,me,find,island and in

after decrypting the message was :
>**find me in hopsec island**

