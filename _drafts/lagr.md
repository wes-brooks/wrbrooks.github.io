---
layout: post
title: Local adaptive grouped regularization (LAGR)
tags: blog rstats
---

It's been a while since I rapped at ya about statistics, and that's down to me being deep in metaphorical jungle of research for this thesis of mine. Today I'm beyond pleased to announce that we're submitting a paper and bumping the corresponding R package up to v0.3!

The topic of both is local adaptive grouped regularization (LAGR, pronounced like the beer). It's a method to select the locally-relevant covariates and estimate their coefficients in a varying-coefficients regression model. I'm linking to (the R package)[https://github.com/wrbrooks/lagr], a draft of the [paper](//somesquares.org/static/pdfs/lagr-estimation.pdf), and the [supplemental material](//somesquares.org/static/pdfs/lagr-estimation-supplement.pdf).

You should be able to install the code via the [devtools](http://www.rstudio.com/products/rpackages/devtools/) with the command `install_github("wrbrooks/lagr")`. It's currently only estimating models with two-dimensional effect modifying parameters (think spatial regression). Documentation is pretty spotty but now that the major functionality is solid I'm going to whip that into shape over the next few weeks.

The paper's abstract is below. I'm pretty proud of this.

###Abstract

Varying coefficient regression is a flexible technique for modeling data where the coefficients are functions of some effect-modifying parameter, often time or location. While there are a number of methods for variable selection in a varying coefficient regression model, the existing methods mostly do global selection, which includes or excludes each covariate over the entire domain. Presented here is a new local adaptive grouped regularization (LAGR) method for local variable selection in spatially varying coefficient linear and generalized linear regression. LAGR selects the covariates that are associated with the response at any point in space, and simultaneously estimates the coefficients of those covariates by tailoring the adaptive group Lasso toward a local regression model with locally linear coefficient estimates. Oracle properties of the proposed method are established under local linear regression and local generalized linear regression. The finite sample properties of LAGR are assessed in a simulation study and for illustration, the Boston housing price data set is analyzed.
