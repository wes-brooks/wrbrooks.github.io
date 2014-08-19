---
layout: post
title: Sailing on Mendota
tags: blog
---

Kate and I put Goats Have No Manners into Lake Mendota for the first time. It was beautiful!

{% for photo in site.ghnm %}<a
    href="{{ site.url }}{{ photo.imagepath }}"
    data-title="{{ photo.caption }}"
    data-lightbox="ghnm"
    class="thumbnail-image-link"> 
        <img class="thumbnail-image" src="{{ site.url }}{% if photo.thumbpath %}{{ photo.thumbpath }}{% else %}{{ photo.imagepath }}{% endif %}">
    </a>
{% endfor %}