---
layout: post
title: Exercise: Bootstrap and engine block data
date: July 6, 2015
tags: blog exercise
---

# Overview
We saw this data last week. A factor manufactures engine blocks for cars, and the last step of the process is to paint the blocks. It is important that the paint be thick enough to withstand high heat without cracking. The plant engineer wants to know how thickly, on average, the paint is being applied on blocks that leave the factory. He has collected a random sample of 16 engine blocks. The paint thicknesses on these were:

$$1.29, 1.12, 0.88, 1.65, 1.48, 1.59, 1.04, 0.83, 1.76, 1.31, 0.88, 1.71, 1.83, 1.09, 1.62, 1.49.$$

(A Q-Q plot is on the back). For these data, we have ${\bar X} = 1.35$ and $S = 0.339$.

# Question 1
How might you find the confidence interval for the population mean of paint thickness? What distribution would you assume for the sample mean?


# Question 2
A bootstrap approach was used to simulate the distribution of the sample mean. With $B=1000$, $B$ independent resamples of size $N=16$ were drawn (with replacement) from the original data. The histogram of these resamples is below.

![Histogram of paint thickness resamples](/images/2015/7/6/hist.png)

- How would the histogram change if we drew more bootstraps (increased B)?
- How would the histogram change if each bootstrap drew 32 samples with replacement, instead of 16 (increased N)?

# Question 3
Following up on question 2, how can we get a bootstrap distribution that's more clustered around the population mean (expectation)?


![QQ plot for the engine block data](/images/2015/7/6/qqnorm.png)