---
layout: post
title:  "Notes on the oracle properties of the nonparametric adaptive lasso"
date:   2014-3-26
---

This is the theorem that must be adapted to prove the oracle properties of the nonparametric adaptive lasso.


# Theorem 2 of Zou (2006)

This is where Zou proves the oracle properties of the adaptive lasso:

Suppose that $\lambda\_n / \sqrt{n} \to 0$ and $\lambda\_n n^{(\gamma - 1)/2} \to \infty$. Then the adaptive lasso estimates must satisfy the following:

1. Consistency in variable selection: $\lim\_n P(\mathcal{A}\_n^\* = \mathcal{A}) = 1$
2. Asymptotic normality: $\sqrt{n} \left( \hat{\boldsymbol{\beta}}\_{\mathcal{A}}^{\*(n)} - \boldsymbol{\beta}\_{\mathcal{A}}^\* \right) \xrightarrow{D} N(\boldsymbol{0}, \sigma^2 \boldsymbol{C}\_{11}^{-1})$.

There is an additional note called _Remark 1_:

 - $\hat{\boldsymbol{\beta}}$ is not required to be root-n consistent for the adaptive lasso. The condition can be greatly weakened. Suppose that there is a sequence of $\left\\{ a\_n \right\\}$ such that $a\_n \to \infty$ and $a\_n \left( \hat{\boldsymbol{\beta}} - \boldsymbol{\beta}^*  \right) = O\_p(1)$. Then the forgoing oracle properties still hold if we let $\lambda\_n = o(\sqrt{n})$ and $a\_n^{\gamma} \lambda\_n / \sqrt{n} \to \infty$.
 
Our proof of the oracle properties of the nonparmetric adaptive lasso is made possible by the result noted in this remark.


# Proof of Theorem 2:

Zou first proves normality. Letting $\boldsymbol{\beta} = \boldsymbol{\beta}^* + \boldsymbol{u} / \sqrt{n}$ and 

$$\begin{align}
\Psi(\boldsymbol{u}) = || \boldsymbol{y} - \sum\_{j=1}^p \boldsymbol{x}\_j \left( \beta\_j^* + \frac{u\_j}{\sqrt{n}} \right) ||^2 + \lambda\_n \sum\_{j=1}^p \hat{w}\_j |\beta\_j^* + \frac{u\_j}{\sqrt{n}} |
\end{align}$$

Let $ \hat{\boldsymbol{u}}^{(n)} = \text{arg min} \Psi\_n(\boldsymbol{u})$; then $\hat{\boldsymbol{\beta}}^{\*(n)} = \boldsymbol{\beta}^\* + \boldsymbol{u} / \sqrt{n}$, so $\hat{\boldsymbol{u}}^{(n}) = \sqrt{n} \left( \boldsymbol{\beta}^{\*(n)} - \boldsymbol{\beta}^\* \right)$.

Note that $\Psi\_n(\boldsymbol{u}) - \Psi\_n(\boldsymbol{0}) = V\_4^{(n)} (\boldsymbol{u})$ where

$$\begin{align} V\_4^{(n)} (\boldsymbol{u}) &\equiv \boldsymbol{u}^T \left( \frac{1}{n} \boldsymbol{X}^T \boldsymbol{X} \right) \boldsymbol{u} - 2 \frac{\boldsymbol{\varepsilon^T \boldsymbol{X}}}{\sqrt{n}} \boldsymbol{u} + \frac{\lambda\_n}{\sqrt{n}} \sum\_{j=1}^p \hat{w}\_j \sqrt{n} \left( | \beta\_j^\* + \frac{u\_j}{\sqrt{n}} | - |\beta\_j^\*| \right)\end{align}$$

The proof of asymptotic normality proceeds by considering the three pieces of the final statement separately.

## First term

$\left( \frac{1}{n} \boldsymbol{X}^T \boldsymbol{X} \right) \to \boldsymbol{C}$, which is the covariance matrix. Since $\boldsymbol{u}$ is a constant (fixed because we're evaluating $V\_4^{(n)} (\boldsymbol{u})$), we have by Slutsky\s theorem that $\boldsymbol{u}^T \left( \frac{1}{n} \boldsymbol{X}^T \boldsymbol{X} \right) \boldsymbol{u} \xrightarrow{a.s.} \boldsymbol{u}^T \boldsymbol{C} \boldsymbol{u}$.

## Second term

Recall that we've assumed that $ \frac{1}{n} \boldsymbol{X}^T \boldsymbol{X} \xrightarrow{a.s.} \boldsymbol{C}$. Now because $\boldsymbol{\varepsilon} \xrightarrow{D} N(\boldsymbol{0}, \sigma^2 I\_n)$, we have by Slutsky's theorem that 


## Third term

The third term is a sum: $\frac{\lambda\_n}{\sqrt{n}} \sum\_{j=1}^p \hat{w}\_j \sqrt{n} \left( |\beta\_j^\* + \frac{u\_j}{\sqrt{n}}| - |\beta\_j^\*| \right)$. Zou considers separately the elements of the sum that correspond to truly relevant predictors, and the elements that correspont to truly irrelevant predictors.

### For truly relevant predictors, i.e., $\beta\_j^* \ne 0$, then:

 - $\frac{\lambda\_n}{\sqrt{n}} \to 0$ (by assumption)
 - $\hat{w}\_j \xrightarrow{p} |\beta\_j^*|^{-\gamma}$
 - $\sqrt{n} \left( |\beta\_j^\* + \frac{u\_j}{\sqrt{n}}| - |\beta\_j^\*| \right) \to u\_j \text{sign}(\beta\_j^\*)$
 
Combining these, we have by Slutsky's theorem that $\frac{\lambda\_n}{\sqrt{n}} \hat{w}\_j \sqrt{n} \left( |\beta\_j^\* + \frac{u\_j}{\sqrt{n}}| - |\beta\_j^\*| \right) \xrightarrow{p} 0$ where $\beta\_j^* \ne 0$.

### For truly irrelevant predictors, i.e., $\beta\_j^* = 0$, then:

 - $\frac{\lambda\_n}{\sqrt{n}} \hat{w}\_j = \frac{\lambda\_n}{\sqrt{n}} |\beta\_j^\*|^{-\gamma} = \frac{\lambda\_n}{\sqrt{n}} |\frac{\sqrt{n} \beta\_j^\*}{\sqrt{n}}|^{-\gamma} = \frac{\lambda\_n}{\sqrt{n}} n^{\gamma / 2} |\sqrt{n} \beta\_j^\*|^{-\gamma}$
 - $\sqrt{n} \left( |\beta\_j^\* + \frac{u\_j}{\sqrt{n}}| - |\beta\_j^\*| \right) = |u\_j|$

Now, since if $\beta\_j^\*  = 0$ then $\sqrt{n} \hat{\beta}\_j = O\_p(1)$, we have (again, by Slutsky's theorem - since everything converges to a constant or a bounded r.v., except the term $\lambda\_n n^{(\gamma-1)/2}$, which goes to $\infty$ by assumption) that $\frac{\lambda\_n}{\sqrt{n}} \hat{w}\_j \sqrt{n} \left( |\beta\_j^\* + \frac{u\_j}{\sqrt{n}}| - |\beta\_j^\*| \right) \to \infty$ where $\beta\_j^* = 0$


##So?

So, we now have that for every $\boldsymbol{u}$, $V\_4^{(n)}(\boldsymbol{u}) \to V\_4(\boldsymbol{u})$, where

$$V\_4(\boldsymbol{u}) = \begin{cases} \boldsymbol{u}\_{\mathcal{A}}^T \boldsymbol{C}\_{11} \boldsymbol{u}\_{\mathcal{A}} - 2 \boldsymbol{u}\_{\mathcal{A}}^T \boldsymbol{W}\_{\mathcal{A}} & \text{ if } u\_j = 0 \;\; \forall j \notin \mathcal{A} \\\\ \infty & \text{ otherwise} \end{cases} $$

Now, $V\_4^{(n)}$ is convex and has a unique minimum at $\left( \boldsymbol{C}\_{11}^{-1} \boldsymbol{W}\_\mathcal{A}, \boldsymbol{0} \right)$. By the epi-convergence results of Geyer(1994) and Knight and Fu (2000), we have that

 - $\hat{\boldsymbol{u}}\_\mathcal{A}^{(n)} \xrightarrow{D} \boldsymbol{C}\_{11}^{-1} \boldsymbol{W}\_\mathcal{A}$
 - $\hat{\boldsymbol{u}}\_{\mathcal{A}^c}^{(n)} \xrightarrow{D} 0$
 
Now, since $\boldsymbol{W}\_\mathcal{A} = N(\boldsymbol{0}, \sigma^2 \boldsymbol{C}\_{11})$, the asymptotic normailty is proven.


#Adapting the proof to the case of SVCR

The key to the adaptation is to realize that the nonparametric coefficient estimation obtains a $n^{1/6}$ rate of convergence, and that the observation weights should appear in the first term of (1), like so:

$$\begin{align}
\Psi(\boldsymbol{u}) = \left\[ \boldsymbol{y} - \sum\_{j=1}^p \boldsymbol{x}\_j \left( \beta\_j^* + \frac{u\_j}{\sqrt{n}} \right) \right\]^{T} \boldsymbol{\mathcal{W}} \left\[ \boldsymbol{y} - \sum\_{j=1}^p \boldsymbol{x}\_j \left( \beta\_j^* + \frac{u\_j}{\sqrt{n}} \right) \right\] + \lambda\_n \sum\_{j=1}^p \hat{w}\_j |\beta\_j^* + \frac{u\_j}{\sqrt{n}} |
\end{align}$$

Where $\boldsymbol{\mathcal{W}} = \text{diag}(w\_{ij})$, though of course these $w$'s are different from those used above as the adaptive weights.

#References

Geyer, C. (1994) "On the asymptotics of constrained M-estimation." _The Annals of Statistics_, 22 1993-2010.

Knight, K., and Fu, W. (2000) "Asymptotics for lasso-type estimators." _The Annals of Statistics_, 28, 1356-1378.

Zou, H (2006), "The adaptive lasso and its oracle properties." _Journal of the American Statistical Association._ 101, 1418-1429.
