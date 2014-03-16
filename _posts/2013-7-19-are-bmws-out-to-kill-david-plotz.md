---
layout: post
title:  "Are BMWs out to kill David Plotz?""
date:   2013-7-19
---

Slate's David Plotz is convinced that [drivers of BMWs are trying to run him down on his bicycle](http://www.slate.com/articles/life/a_fine_whine/2013/07/bmw_drivers_and_cyclists_the_war_between_the_luxury_cars_and_bicycles.html). Are they?

Plotz tells us that, over a period of years, he's counted twenty drivers passing him aggressively. Of those twenty, ten were BMWs (for the sake of this post, let's assume that Plotz accurately recalls these numbers). He furthermore tells us that BMW accounts for 2% of the US car market. So clearly, BMW drivers account for more than their share of these incidents.

Let's look at the math briefly. Suppose our experiment is to wait for 20 aggressive drivers, then count the proportion that drive BMWs, in order to test the null hypothesis that there is no difference between the rate of aggressive BWM drivers and aggressive non-BMW drivers.

It seems reasonable to assume that Plotz' encounters with aggressive drivers are independent and "memoryless" (meaning that each incident can occur at any time, without regard for when any of the other incidents occurred). That suggests that Plotz' encounters with aggressive drivers are Poisson-distributed.

That's a convenient distribution because it means that, if we just look at the first twenty aggressive drivers, the number of BMW drivers among them is binomially-distributed, with the proportion: $$p_{\text{BMW}} = \frac{\lambda_{\text{BMW}}}{\lambda_{\text{BMW}} + \lambda_{\text{not-BMW}}}$$

where \\(\lambda_{\text{BMW}}\\) is, roughly, the number of BMWs in DC and \\(\lambda_{\text{non-BMW}}\\) is the number of non-BMW cars in DC.

Now, setting  \\(p_{\text{BMW}}\\) to the national market share of 2%, we can run 10,000 simulations of Plotz' twenty drivers and see how many drove simulated BMWs:

![Histogram of aggressive BMW drivers](http://somesquares.org/static/img/BMW-histogram-1.png)

Of the 10,000 simulations, five had Plotz seeing four aggressive BMW drivers, and none had five or more. So there is essentially zero chance that Plotz' data would arise in a world where BMW drivers are no more likely than others to aggressively pass him.

Note, though, that we assume BMW's market share in DC (where Slate is located) matches its national market share. But this clearly isn't true: since nice cars cost the same whether you live in Wisconsin or in DC, while [the three richest counties in the US are suburbs of DC](http://en.wikipedia.org/wiki/List_of_highest-income_counties_in_the_United_States), it is clear that BMWs are much less expensive as a share of annual income in the DC area than they are in most of the country. So we can expect DC to be BMW-enriched.

Sadly, cursory Googling didn't tell me the BMW market share in DC. So I decided to look at what range of \\(p_{\text{BMW}}\\) is consistent with Plotz' observed data. \\(p_{\text{BMW}}\\) was swept from 0 to 1 and the distribution function was used to find the 95% confidence interval:

![Distribution of aggressive BMW drivers](http://somesquares.org/static/img/BMW-distribution-1.png)

Assuming that BMW drivers are no more likely than other drivers to be aggressive toward David Plotz, cyclist, **the 95% confidence interval on BMW's DC market share is from 32% to 73%** (indicated by the red dashed lines).

My instincts tell me that BMW's actual market share in DC is well below one-third, which means **the evidence suggests that drivers of BMWs are out to kill David Plotz**.

Maybe they're upset that he never lets Emily Bazelon get a word in edgewise during the Gabfest?