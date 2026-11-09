---
id: 22
title: Advent of Cyber 2025: Day 22
date: 2025-12-22
category: CTF
difficulty: Medium
readTime: 7 min
---

## Introduction 
Today's Box is about detecting C2 (command and control) with Rita
(Real Intelligence Threat Analytics)

## Walkthrough
I started it with parsing pcap file into zeek logs using zeek
`zeek readpcap pcaps/AsyncRAT.pcap zeek_logs/asyncrat/`

Now i have to import this into Rita to do the analytic work 
`rita import --logs asyncrat/ --database asyncrat`

To view the output
`rita view asyncrat`

Now for the challenge time . i have to analyse a file `~/pcaps/rita_challenge.pcap`
so i have done the same steps as above 

so there are total of **6** hosts communicating with malhare.net

threat model that tells us host communicating to a certain destination
> **Prevalence **

highest no of connection to malhare.net
>**40**

And for the qn "which search filter would you use to search for all entries that communicate to **rabbithole.malhare.net** with a **beacon score** greater than 70% and sorted by **connection duration (descending)**"
>**dst:rabbithole.malhare.net beacon:>=70 sort:duration-desc**

