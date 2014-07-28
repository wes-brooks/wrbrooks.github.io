---
layout: post
title:  "Pass R/C++ functions into Rcpp11 code"
date:   2017-7-25
tags: blog
---

R has first-class functions, meaning functions are objects. One nice result is that you can pass functions into other functions in order to provide some custom functionality. For instance, if you're writing code to fit a generalized linear model, you might want to let your user specify their own link and likelihood functions, 

Under the old Rcpp, if you wanted to pass C++ functions dynamically