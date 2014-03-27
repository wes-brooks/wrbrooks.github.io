---
layout: post
title: ggvis test
categories: blog
---

![Alt text](/svg/ggvis-test.svg)

{% highlight R %}
slider <- input_slider(10, 1000, label = "size")
ggvis(mtcars, props(x = ~wt, y = ~mpg)) +
  layer_point(props(fill := "red", size := slider)) +
  layer_point(props(stroke := "black", fill := NA, size := slider))
{% endhighlight %}