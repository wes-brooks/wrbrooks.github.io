---
layout: post
title:  "Notes on the oracle properties of the nonparametric adaptive lasso"
date:   2014-3-26
---

### Theorem 2 of Zou (2006)

This is where Zou proves the oracle properties of the adaptive lasso:

Suppose that $\lambda\_n / \sqrt{n} \to 0$ and $\lambda\_n n^{(\gamma - 1)/2} \to \infty$. Then the adaptive lasso estimates must satisfy the following:

1. Consistency in variable selection: $\lim\_n P(\mathcal{A}\_n^\* = \mathcal{A}) = 1$
2. Asymptotic normality: $\sqrt{n} \left( \hat{\boldsymbol{\beta}}\_{\mathcal{A}}^{\*(n)} - \boldsymbol{\beta}\_{\mathcal{A}}^\* \right) \xrightarrow{D} N(\boldsymbol{0}, \sigma^2 \boldsymbol{C}\_{11}^{-1})$.

There is an additional note called _Remark 1_:

 - $\hat{\boldsymbol{\beta}}$ is not required to be root-n consistent for the adaptive lasso. The condition can be greatly weakened. Suppose that there is a sequence of $\left\\{ a\_n \right\\}$ such that $a\_n \to \infty$ and $a\_n \left( \hat{\boldsymbol{\beta}} - \boldsymbol{\beta}^*  \right) = O\_p(1)$. Then the forgoing oracle properties still hold if we let $\lambda\_n = o(\sqrt{n})$ and $a\_n^{\gamma} \lambda\_n / \sqrt{n} \to \infty$.
 
Our proof of the oracle properties of the nonparmetric adaptive lasso is made possible by the result noted in this remark.








###References

Zou, H (2006), "The adaptive lasso and its oracle properties." _Journal of the American Statistical Association._ 101, 1418-1429.
