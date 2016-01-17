---
layout: post
title:  "Exercise: free throw shooting"
date:   2015-6-23
tags: blog exercise
excerpt: "In the process of covering crucial distributions like the binomial and the normal, I want my students to be exposed to some uses we will eventually encounter, like hypothesis testing. Also, this exercise is intended to emphasize that a probability distribution is a simple model of a population (not of the observed data), which we adopt by assumption. Then statistical techniques can compare the evidence in the data against the consequences implied by the assumed distribution."
---

#Objective
In the process of covering crucial distributions like the binomial and the normal, I want my students to be exposed to some uses we will eventually encounter, like hypothesis testing. Also, this exercise is intended to emphasize that a probability distribution is a simple model of a population (not of the observed data), which we adopt by assumption. Then statistical techniques can compare the evidence in the data against the consequences implied by the assumed distribution.

Anyway, this exercise was partially successful. The big problem was the vague wording of the questions.

Students mostly were brought around to grasp what will become the tenets of hypothesis testing, even though we haven't discussed it as such. I was impressed at their mental flexibility as the groups worked out for themselves that they needed to assume a Bin$(10, 0.8)$, distribution and calculate the probabilities using that assumption.

# Exercise

## Setup
Your buddy wants to join your intramural basketball team. She insists that she makes 80% of her free throws, and you do need a good shooter. To decide whether to add her to the team, you go to the SERF and shoot some free throws.

## Data
She shoots 10 free throws and makes 6, which is just 60%. Assume that each free throw is an independent outcome. Also assume that the probability of an 80% free throw shooter making 4 or fewer shots out of 10 is indistinguishable from zero.

## Questions

 - If she really is an 80% free throw shooter, what is the probability of this outcome?

Based on the prior calculation, you say she does not tend to make 80% of her free throws. She says that you calculated the wrong value - that before dismissing the idea that she's genuinely as good as she claims, you should calculate the probability that an 80% shooter would make 6 free throws *or fewer* out of 10.

 - What is this probability?
 - Why does her claim make sense?

After a brief argument, you agree to settle the rules first and then repeat the 10-shot experiment to decide if she is on the team. You agree that she should make enough free throws that, in the world's biggest gym, with a Guinness record number of basketball hoops, and an 80% shooter taking 10 shots at each one, she would score equal to or higher than at least 25% of the people.

 - What is the minimum number of shots she must hit to make the team?

## Facts about the binomial distribution:
These should help you calculate the necessary probabilities.

$$X \sim {\rm Binomial}(n, \pi) \;\;\;\; p(x) = \left( \frac{n!}{x! (n-x)!} \right) \pi^x (1-\pi)^{n-x}$$

| $\frac{10!}{5! (10-5)!}$ | $\frac{10!}{6! (10-6)!}$ | $\frac{10!}{7! (10-7)!}$ | $\frac{10!}{8! (10-8)!}$ | $\frac{10!}{9! (10-9)!}$ | $\frac{10!}{10! (10-10)!}$ |
|:-:|:-:|:-:|:-:|:-:|:-:|
| 252 | 210 | 120 | 45 | 10 | 1 |