---
layout: post
title:  "Nonparametric GLM estimation"
date:   2014-3-16
---

These results are proved in Fan, Heckman, and Wand (1995). Let $p$ be the order of the polynomial approximation (typically, $p=1$), and $r$ be the order of derivative of the nonparametric function under estimation (typically, $r=0$.) Let $p - r \> 0$ be odd and the conditions in the appendix satisfied.

Further assume that $h=h\_n \rightarrow 0$ and $nh^3 \rightarrow \infty$ as $n \rightarrow \infty$.

If $x$ is a fixed point on the interior of the support of $f(x)$ (which is the density of the locations of $X$), then:

$$\sqrt{nh^{2r+1}}\sigma\_{r,p}(x;K)^{-1} \times \left[ \hat{\eta}\_r (x;p,h) - \eta^{(r)}(x) - \left\\{ \int z^{p+1} K\_{r,p}(z) dz \right\\} \left\\{\frac{\eta^{(p-1)}(x)}{(p+1)!} \right\\} h^{p-r+1}\left\\{1 + O(h)\right\\}\right] \xrightarrow{D} N(0,1)$$

If $x$ is near the boundary of the support of $f$ then the above result is slightly changes (see Fan, Heckman and Wand (1995), theorem 1a).

