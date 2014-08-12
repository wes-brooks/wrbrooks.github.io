---
layout: gallery
title: Testing a highslide gallery
tags: blog
---

This is a test of adding a (Highslide)[http://highslide.com] gallery in a Markdown document for Jekyll.

<div class="highslide-gallery">
<ul>
{% for photo in site.ghnm %}
<li>
<a href="{{ site.url }}{{ photo.imagepath }}" class="highslide" 
        title="Caption from the anchor's title attribute" 
        onclick="return hs.expand(this, config1 )">
    <img src="{{ site.url }}{{ photo.thumbpath }}"  alt=""/>
</a>
</li>
{% endfor %}
</ul>
<div style="clear:both"></div></div>