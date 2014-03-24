---
layout: post
title:  "A note on the proof of theorem 3 of Sun, Yan, Zhang, and Lu"
date:   2014-3-24
---
## Statement of theorem 3:

Under the assumptions of theorem 1, if $nh\_1^6 = O(1)$ and $h/h\_1 \to 0$, then

$$\sqrt{n h\_1^2 f(s)} \left( \hat{\boldsymbol{\beta}}(s) - \boldsymbol{\beta}(s) - 2^{-1} \kappa\_0^{-1} \kappa\_2 h\_1^2 \{ \boldsymbol{\beta}\_{uu}(s) + \boldsymbol{\beta}\_{vv}(s) \} \right)  \xrightarrow{D} N\left( \boldsymbol{0}, \kappa\_0^2 \nu\_0 \sigma^2 \Psi^{-1} \right)$$

for any given $s$.



### Lemma 2 sets the stage for the CLT:

Under conditions (1)-(4), then when $n^{1/2} h^2 / \log^2 n \to \infty$,

$$n^{-1} H^{-1} \mathcal{X} \mathcal{W} \mathcal{X} H^{-1} = \begin{pmatrix} \kappa\_0 f(s) \Psi & \boldsymbol{0}\_{p \times 2p} \\\\ \boldsymbol{0}\_{2p \times p} & \kappa\_2 f(s) \Psi \otimes I\_2 \end{pmatrix} + O\_P(c\_n \boldsymbol{1}\_{3p} \boldsymbol{1}\_{3p}^T)$$

holds uniformly in $s \in \mathcal{S}$ where $c\_n = h + \left\\{ \frac{\log n}{n h^2} \right\\}^{1/2}$,


