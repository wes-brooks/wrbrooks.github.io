---
layout: post
title:  "Integrating mathjax and markdown in django"
date:   2013-4-20
tags: blog
---

### Update

I've moved the blog to (Github Pages)[http://pages.github.com] which means that my content management system is now (Jekyll)[http://jekyllrb.com], not Django. I'm leaving this post up, but I no longer use the hack described below.

The simple way to make MathJax work with a blog written in Markdown is to simply escape all the underscores and asterisks (along with some slashes). For example, to generate the equation at the bottom of this page you'd ordinarily write the MathJax code `$$\text{SSR} = \sum\limits_{i=1}^n \left(y_i - \boldsymbol{x}'_i\hat{\boldsymbol{\beta}}\right)^2$$`. Markdown, though, thinks everything between the two underscores is supposed to be italic. But if you escape the underscores (that is, replace each appearance of `_` with `\_`), then it just works!

You will need to do the same with asterisks (`*` becomes `\*`), newlines (`\\` becomes `\\\\`), and some other marks, too (`\left\{` becomes `\left\\{`).

### Original post follows:

I'm a JavaScript noob so it took a couple days of hacking but I finally integrated mathjax and markdown into my django blog (this one!) together.

The basic problem is that markdown is a sleek little markup language that was designed to be totally minimal so that it's natural for humans to read and write it. But being minimal, it is hard to customize. And since some markdown syntax clobbers mathjax syntax (e.g. the underscore), we need to customize markdown, telling it to ignore the text that is meant for mathjax.

The solution is to follow four steps: 

 1. Strip the mathjax out of the markdown input, store it, and replace it with placeholder text (`"@@<blocknumber>@@"` in this case)
 2. Convert the remaining text (all markdown) to html
 3. Process the mathjax to html
 4. Reinsert the processed mathjax into the processed markdown at the locations indicated by the placeholders 

[This post](http://stackoverflow.com/questions/11228558/let-pagedown-and-mathjax-work-together) was super helpful. I had to look through the linked code many times, comparing it to the contents of [django-pagedown](https://github.com/timmyomahony/django-pagedown). Finally, I saw that the answer would be quite simple:

 * Install [django-pagedown](https://github.com/timmyomahony/django-pagedown/tree/master/pagedown)
 * Link to the mathjax javascript library by adding this code to my base.html template:
{% highlight javascript %}<script type="text/javascript" src="https://c328740.ssl.cf1.rackcdn.com/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>{% endhighlight %}
 * Save [this code](http://somesquares.org/static/js/mathjax-editing.js) (hat tip to David Cervone for his answer to [this stackoverflow question](http://stackoverflow.com/questions/11228558/let-pagedown-and-mathjax-work-together)) to a file called mathjax-editing.js
 * Add the following code to mathjax-editing.js, just after `'use strict';` : `window.StackExchange = {};`
 * In pagedown/widgets.py, after the line `var editor = new Markdown.Editor(converter, "", selectors);` (which is line 44 in the version I downloaded April 15, 2013), add these two lines:
{% highlight javascript %}var postfix = "";
StackExchange.mathjaxEditing.prepareWmdForMathJax(editor, postfix, [["$", "$"], ["\\\\(","\\\\)"]]);{% endhighlight %}
 * Add these two items to the `js` tuple in the `Meta` subclass of the `PagedownWidget`class in `pagedown/widgets.py`:
{% highlight python %}'https://c328740.ssl.cf1.rackcdn.com/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML'
'%s/js/mathjax-editing.js' % settings.STATIC\_URL{% endhighlight %}

Then you just need to run `python manage.py collectstatic` and restart your server - boom! MathJaxxy goodness like this:

<div>$$
\text{SSR} = \sum\limits_{i=1}^n \left(y_i - \boldsymbol{x}'_i\hat{\boldsymbol{\beta}}\right)^2
$$</div>