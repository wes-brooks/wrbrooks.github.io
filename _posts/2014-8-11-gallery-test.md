---
layout: post
title: Testing a Lightbox gallery
tags: blog
---

This is a test of adding a [Lightbox](http://lokeshdhakar.com/projects/lightbox2/) gallery in a Markdown document for Jekyll.

<div class="gallery">
<ul>
{% for photo in site.ghnm %}
<li>
<a href="{{ site.url }}{{ photo.imagepath }}" src="{{ site.url }}{% if photo.thumbpath %}{{ photo.thumbpath }}{% else %}{{ photo.imagepath }}{% endif %}" data-title="{{ photo.caption }}" data-lightbox="ghnm"></a>
</li>
{% endfor %}
</ul>
</div>