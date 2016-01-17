---
layout: post
title: "Exercise: Estimating a linear model"
date: 2015-07-27
tags: blog exercise
excerpt: "This exercise was intended to show students that linear regression is comprehensible and intuitive. They mostly came up with very similar solutions. With a little prompting, every group eventually said that they would summarize their model by the slope and intercept."
---

# Objective
This exercise was intended to show students that linear regression is comprehensible and intuitive. They mostly came up with very similar solutions. With a little prompting, every group eventually said that they would summarize their model by the slope and intercept.

A couple of groups got the influence question right, and they had different approaches for it. One noted that there are more dots below the best-fit line than above, and that the dots abover were toward the ends while the dots below were in the center. They concluded that the dots above the regression line must have greater weight to "balance" the dots below the regression line.

Another group noted that a small change to slope would affect the fit to observations far from ${\bar X}$ more than those near to ${\bar X}$, and concluded that those observations have more influence.

# Exercise

## Setup
Suppose you're working on a car design and need to study the relationship between car weight and fuel efficiency. You have produced the following plot:

![Fuel efficiency of several car models versus their weight](/images/2015/7/27/mpg.png){:.pure-img}

## Questions

1. Draw a straight-line model that best fits the data.
2. For a vehicle weight of 3000 pounds, what is the approximate fitted value of your model?
3. For data points A, B, and C, what are their (approximate) residuals under your model?
4. Can you summarize your model by a few numbers?
5. How might you estimate those numbers mathematically?
6. Do all the observations in the plot have equal influence on the fitted model? If not, which have the most influence?