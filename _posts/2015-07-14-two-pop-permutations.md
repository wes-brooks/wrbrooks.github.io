---
layout: post
title: "Exercise: Two-population permutation test"
date: 2015-07-14
tags: blog exercise
---

# Objective
To now, our coverage of hypothesis testing has been almost exclusively about t-tests, which was the decision of the course planners. I personally think that permutation tests are more important for developing the logic and intuition of hypothesis testing. Today's exercise had the students generate permutations for a permutation test. Based on their permutations, I generated a histogram of the difference in sample means according to the null hypothesis, and calculated a p-value, which closely matched what we'd gotten via a t-test.

To my dismay, students seemed to think the permutation test was a waste of time or a diversion. Some kind of side project to t-tests, which they think are more useful. So they were kind of bored during this exercise, and got a bit off-track. However, one student did come up after class to ask why we would ever use permutations, and seemed interested in hearing more.

To prepare for this exercise, I got a bunch of cheap white poker chips. On each one, I wrote one data value, and each group got a plastic bowl filled with 11 chips that represented the observed data. We ended up with six groups of four, so the prep work wasn't too bad.

We never got to the follow-up questions, so I answered them in lecture.

# Exercise

## Setup
Recall that you work at a bicycle factory where you'd like to replace steel tubes in the company's bicycle frames with titanium (because it's lighter). You have carefully selected random samples of the steel and titanium tubes from your suppliers. You measure the stiffness of each tube in a testing rig. The data are (measured in pounds per square inch, psi):

$${\rm Steel}: \;\;\; 30.7, 29.5, 29.8, 30.3, 29.2$$

$${\rm Titanium}: \;\;\; 29.9, 31.1, 30.2, 30.8, 30.7, 31.9$$

## Exercise
You're going to perform a permutation test. From your cup, draw a sample (*without* replacement, which is new for us) of size six and calculate its mean. Calculate the mean of the remaining five chips. Write these numbers down, and call them out to me. Then return the chips to your cup and repeat the process until I say stop.

## Questions

- What does the first mean for each sample represent? The second mean?
- In order to perform a statistical hypothesis, you need a test statistic. Can you think of how to interpret your work as a test statistic?
- Statistical hypothesis testing also requires that you have the distribution of your test statistic, assuming that the null hypothesis is true. Can you think of how to get this distribution from your work here?
- Finally, can you think of how to perform the test?