//This function turns Markdown's "Alt" text into a figure caption
$(document).ready(function() {
	// Every image referenced from a Markdown document
	$(".markdown img").each(function() {
		// Let's put a caption if there is one
		if($(this).attr("alt"))
			$(this).wrap('<figure class="image"></figure>')
				.after('<figcaption>'+$(this).attr("alt")+'</figcaption>');
		});
});

//Link this page to Google Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-40826699-1', 'somesquares.org');
        ga('send', 'pageview');


//Twitter "share" button
!function(d,s,id) {
  var js, fjs = d.getElementsByTagName(s)[0], p=/^http:/.test(d.location)?'http':'https';
  if (!d.getElementById(id)) { 
    js = d.createElement(s);
	js.id = id;
	js.src = p + '://platform.twitter.com/widgets.js';
	fjs.parentNode.insertBefore(js,fjs);
  }
}(document, 'script', 'twitter-wjs');