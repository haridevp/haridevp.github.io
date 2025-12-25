---
id: 24
title: Advent of Cyber 2025: Day 24
date: 2025-12-24
category: CTF
difficulty: Easy
readTime: 7 min
---

## Introduction
Today's Lab is about : -
- Understand what HTTP requests and responses are at a high level.
- Use cURL to make basic requests (using GET) and view raw responses in the terminal.
- Send POST requests with cURL to submit data to endpoints.
- Work with cookies and sessions in cURL to maintain login state across requests.

## Walkthrough
So i need to access a website using only using cli . So i used curl to contact website which returned that the web server is alive 
so onto our next step , i want to know what all different subdomains exist in the website . 
*Note : - In this case Tryhackme already provided that /post.php is available*
So i tried connecting it using common username and passwords
`curl -X POST -d "username=user&password=user&submit=Login" http://10.48.163.121/post.php`
Well nothing worked ..
so i tried with saved cookies 
`curl -b cookies.txt http://10.48.163.121/session.php`
Which returned 
*Please log in first by POSTing to this page*

So time for a brute force ...
well password found **secretpass**

Now for the Flag ,
```
curl -s -X POST -d "username=admin&&password=admin" http://10.48.163.121/post.php

```

>**THM{curl_post_success}**

```
curl -s -c cookie.txt -d "username=admin&&password=admin" http://10.48.163.121/cookie.php

```

```
curl -s -b cookie.txt http://10.48.163.121/cookie.php
```

>**THM{session_cookie_master}**

After using brute force for /bruteforce.php
>**secretpass**

```
curl -s -X POST -A TBFC http://10.48.163.121/agent.php

```

>**THM{user_agent_filter_bypassed}**

With this challenge, Advent of Cyber has come to an end.  
Wishing everyone a Merry Christmas and happy hacking!