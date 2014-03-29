---
layout: post
title:  "Asymptotic normality of the nonparametric adaptive lasso"
date:   2014-3-29 18:00:00
tags: notebook
---

This is an adaptation of the proof from Zou (2006), (see the post [here](//somesquares.org/blog/oracle-properties-of-the-adaptive-lasso).

#Adapting the proof to the case of SVCR

The convergence rage of the nonparametric estimate is not the same $\sqrt{n}$ as for parametric estimation, so for now replace $\sqrt{n}$ with a placeholder, call it $b\_n$.

Once again, we look at the loss incurred by making an error when estimating the coefficients. In the parametric case, we showed that (asymptotically) the loss is a quadratic form of the error so long as all the coefficients that _should_ be set to zero _are_ set to zero. If any of the truly zero coefficients are estimated as nonzero, the loss is (asymptotically) infinite. We attempt to recover the same result in the nonparametric case.

Begin by defining $\Psi(\boldsymbol{u})$:

$$
\begin{align}
\Psi'(\boldsymbol{u}) = \left\[ \boldsymbol{y} - \sum\_{j=1}^p \boldsymbol{x}\_j \left( \beta\_j^* + \frac{u\_j}{b\_n} \right) \right\]^{T} \mathcal{W} \left\[ \boldsymbol{y} - \sum\_{j=1}^p \boldsymbol{x}\_j \left( \beta\_j^* + \frac{u\_j}{b\_n} \right) \right\] + \lambda\_n \sum\_{j=1}^p |\tilde{\beta}\_j|^{-1} |\beta\_j^* + \frac{u\_j}{b\_n} |
\end{align}
$$

Where $\mathcal{W} = \text{diag}(w\_{ij})$, though of course these $w$'s are different from those used above as the adaptive weights. The results still follow.

Now $\Psi\_n(\boldsymbol{u}) - \Psi\_n(\boldsymbol{0}) = V\_4^{(n)} (\boldsymbol{u})$ where

$$\begin{align} V\_4^{(n)} (\boldsymbol{u}) &\equiv \boldsymbol{u}^T \left( \frac{1}{n} \boldsymbol{X}^T \boldsymbol{X} \right) \boldsymbol{u} - 2 \frac{\boldsymbol{\varepsilon^T \boldsymbol{X}}}{b\_n} \boldsymbol{u} + \frac{\lambda\_n}{b\_n} \sum\_{j=1}^p \hat{w}\_j b\_n \left( | \beta\_j^\* + \frac{u\_j}{b\_n} | - |\beta\_j^\*| \right)\end{align}$$

#References

Geyer, C. (1994) "On the asymptotics of constrained M-estimation." _The Annals of Statistics_, 22 1993-2010.

Knight, K., and Fu, W. (2000) "Asymptotics for lasso-type estimators." _The Annals of Statistics_, 28, 1356-1378.

Zou, H (2006), "The adaptive lasso and its oracle properties." _Journal of the American Statistical Association._ 101, 1418-1429.
