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


### Proof of Theorem 2:

Zou first proves normality. Letting $\boldsymbol{\beta} = \boldsymbol{\beta}^* + \boldsymbol{u} / \sqrt{n}$ and 

$$ \Psi(\boldsymbol{u}) = || \boldsymbol{y} - \sum\_{j=1}^p \boldsymbol{x}\_j \left( \beta\_j^* + \frac{u\_j}{\sqrt{n}} \right) ||^2 + \lambda\_n \sum\_{j=1}^p \hat{w}\_j |\beta\_j^* + \frac{u\_j}{\sqrt{n}} | $$

Let $ \hat{\boldsymbol{u}}^{(n)} = \text{arg min} \Psi\_n(\boldsymbol{u})$; then $\hat{\boldsymbol{\beta}}^{\*(n)} = \boldsymbol{\beta}}^\* + \boldsymbol{u} / \sqrt{n}$, so $\hat{\boldsymbol{u}}^{(n}) = \sqrt{n} \left( \boldsymbol{\beta}^{\*(n)} - \boldsymbol{\beta}^\* \right)$. Note that $\Psi\_n(\boldsymbol{u}) - \Psi\_n(\boldsymbol{0}) = V\_4^{(n)} (\boldsymbol{u})$ where $V\_4^{(n)} (\boldymbol{u}) \equiv \boldsymbol{u}^T \left( \frac{1}{n} \boldsymbol{X}^T \boldsymbol{X} \right) \boldsymbol{u} - 2 \frac{\boldsymbol{\varepsilon^T \boldsymbol{X}}}{\sqrt{n}} \boldsymbol{u} + \frac{\lambda\_n}{\sqrt{n}} \sum\_{j=1}^p \hat{w}\_j \sqrt{n} \left( | \beta\_j^\* + \frac{u\_j}{\sqrt{n}} | - |\beta\_j^\*| \right)$





###References

Zou, H (2006), "The adaptive lasso and its oracle properties." _Journal of the American Statistical Association._ 101, 1418-1429.
