/**
*	Site-specific configuration settings for Highslide JS
*/
hs.graphicsDir = '//somesquares.org/highslide/graphics/';

hs.showCredits = false;

hs.outlineType = 'custom';

hs.dimmingOpacity = 0.75;

hs.align = 'center';

hs.captionEval = 'this.a.title';

hs.captionOverlay.position = 'below';





// Add the slideshow controller

hs.addSlideshow({

	slideshowGroup: 'group1',

	interval: 5000,

	repeat: false,

	useControls: false

});



// gallery config object

var config1 = {

	slideshowGroup: 'group1',

	transitions: ['expand', 'crossfade']

};

