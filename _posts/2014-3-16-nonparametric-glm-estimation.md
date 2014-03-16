---
layout: post
title:  "Nonparametric GLM estimation"
date:   2014-3-16
---

## The theorem

These results are proved in Fan, Heckman, and Wand (1995). Let $p$ be the order of the polynomial approximation (typically, $p=1$), and $r$ be the order of derivative of the nonparametric function under estimation (typically, $r=0$.) Let $p - r \> 0$ be odd and the conditions in the appendix satisfied.

Further assume that $h=h\_n \rightarrow 0$ and $nh^3 \rightarrow \infty$ as $n \rightarrow \infty$.

If $x$ is a fixed point on the interior of the support of $f(x)$ (which is the density of the locations of $X$), then:

$$\sqrt{nh^{2r+1}}\sigma\_{r,p}(x;K)^{-1} \times \left[ \hat{\eta}\_r (x;p,h) - \eta^{(r)}(x) - \left\\{ \int z^{p+1} K\_{r,p}(z) dz \right\\} \left\\{\frac{\eta^{(p-1)}(x)}{(p+1)!} \right\\} h^{p-r+1}\left\\{1 + O(h)\right\\}\right] \xrightarrow{D} N(0,1)$$

If $x$ is near the boundary of the support of $f$ then the above result is slightly changes (see Fan, Heckman and Wand (1995), theorem 1a).

## How does the proof work?

### Standard GLM stuff

Let $\eta(x)$ be the underlying linear predictor (a misnomer in this case). Then The mean ($E\left[Y|X=x\right]$) is $\mu(x)$, and is related to $\eta$ by the link function $g(\cdot)$:

$$\eta(x) = g(\mu(x))$$

or, equivalently:

$$\mu(x) = g^{-1}(\mu(x))$$.

Note that in this case, the $x$ variable is the location.

### Estimating a nonparametric $\eta$
We're interested in estimating the $eta$ function at each location. So do a Taylor expansion of $\eta$ around our fixed location $x$:

$$\eta(y) \approx \eta(x) + \nabla \eta(x)(y-x) + O((y-x)^2)$$

and since $y-x \< h\_n$ ($h\_n$ the bandwidth), we have that 

$$\eta(y) \approx \eta(x) + \nabla \eta(x)(y-x) + O(h\_n^2)$$