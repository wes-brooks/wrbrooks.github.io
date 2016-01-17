---
layout: post
title: "Exercise: Two-population hypothesis testing concepts"
date: 2015-07-13
tags: blog exercise
excerpt: "This was our exercise on the first day covering hypothesis testing for two independent populations. I wanted students to come up on their own with the form of a two-population hypothesis test, and with a basic idea of the test statistic. Everyone nailed $H_0: \\mu_S = \\mu_T$."
---

# Objective
This was our exercise on the first day covering hypothesis testing for two independent populations. I wanted students to come up on their own with the form of a two-population hypothesis test, and with a basic idea of the test statistic. Everyone nailed $H_0: \mu_S = \mu_T$.

Wording of the second and third questions was intentionally vague to make the students think. It was partially successful - several groups originally wrote that tunder the null hypothesis, the stiffness of the samples is the same, even though the data contradicts that statement. After some leading questions they all got to the statement that the difference in sample means should tend to be small under the null.

Some groups rushed through and tried to calculate t-statistics for the third question, which was specifically against my wishes (and they didn't yet know what they were doing). However, a couple of groups did well and suggested either a t-test somehow based on ${\bar S} - {\bar T}$ (which was exactly what I wanted to hear), or a permutation test (which was beyond what I hoped they would come up with).


# Exercise

## Setup
We have talked several times about using data to test whether the expectation of a population is equal to some value. We tended to write the null hypothesis like this:

$$H_0: \mu = 7$$

Now, imagine that you work at a bicycle factory where you'd like to replace steel tubes in the company's bicycle frames with titanium (because it's lighter). You have carefully selected random samples of the steel and titanium tubes from your suppliers. You measure the stiffness of each tube in a testing rig. The data are (measured in pounds per square inch, psi):

$${\rm Steel}: \;\;\; 30.7, 29.5, 29.8, 30.3, 29.2$$

$${\rm Titanium}: \;\;\; 29.9, 31.1, 30.2, 30.8, 30.7, 31.9$$

## Question

- In order for the bicycles to perform the same after the switch, you would like to have tubes with identical stiffness. How might you write down the null hypothesis that the expected stiffness is the same between the two groups?
- If the null hypothesis is true, then what can we say about the samples of steel and titanium tubes?
- Can you construct a test statistic that would be useful for testing these hypotheses? Brainstorm as many ideas as you can, but don't bother with calculations.