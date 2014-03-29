---
layout: post
title:  "Asymptotic normality of the nonparametric adaptive lasso"
date:   2014-3-29 18:00:00
tags: notebook
---

This is an adaptation of the proof from Zou (2006), (see the post (here)[//somesquares.org/blog/oracle-properties-of-the-adaptive-lasso].

#Adapting the proof to the case of SVCR

The key to the adaptation is to realize that the nonparametric coefficient estimation obtains a $n^{1/6}$ rate of convergence, and that the observation weights should appear in the first term of (1), like so:

$$\begin{align}
\Psi'(\boldsymbol{u}) = \left\[ \boldsymbol{y} - \sum\_{j=1}^p \boldsymbol{x}\_j \left( \beta\_j^* + \frac{u\_j}{\sqrt{n}} \right) \right\]^{T} \mathcal{W} \left\[ \boldsymbol{y} - \sum\_{j=1}^p \boldsymbol{x}\_j \left( \beta\_j^* + \frac{u\_j}{\sqrt{n}} \right) \right\] + \lambda\_n \sum\_{j=1}^p \hat{w}\_j |\beta\_j^* + \frac{u\_j}{\sqrt{n}} |
\end{align}$$

Where $\mathcal{W} = \text{diag}(w\_{ij})$, though of course these $w$'s are different from those used above as the adaptive weights. The results still follow.


#References

Geyer, C. (1994) "On the asymptotics of constrained M-estimation." _The Annals of Statistics_, 22 1993-2010.

Knight, K., and Fu, W. (2000) "Asymptotics for lasso-type estimators." _The Annals of Statistics_, 28, 1356-1378.

Zou, H (2006), "The adaptive lasso and its oracle properties." _Journal of the American Statistical Association._ 101, 1418-1429.
