Y.use('node', function(Y) {

var selectors = {    
    DETAIL_PAGE: '#displaypage-overview-details'
    ,BUTTONS_CONTAINER: '.main-content'
    ,BUTTON_NETFLIXQ: '.netflixq'
};

// netflix creates some ids like m70102568_0, m70102568_1 and so forth for different elements
// in the page for a particular movie. use this to extract the uuid part.
var extractid = function(href) {
    return href.match(/[\d].*?[&]/)[0];
};

var saveMovie = function(movie) {
    chrome.extension.sendMessage(movie, function(response) {
        if(chrome.extension.lastError) {
            console.log("Error:" + chrome.extension.lastError);
        }
    });
}; 

var createButton = function() {
    // Y.Node.create()
};

var animButton = function(button) {

    var toAnim = button.cloneNode(true)
        .setStyles({
            display: "block",
            position:"absolute",
            width: button.getComputedStyle('width'), 
            height: button.getComputedStyle('height'), 
            top: button.getY(),
            left: button.getX()
        });

    Y.one("body").append(toAnim);

    toAnim.transition({
        duration: 1, // seconds
        top: button.get('docScrollY')+'PX',
        left: button.get('winWidth')+'PX',
        opacity: 0
    });

};

var detailPage = function() {
    var display = Y.one(selectors.DETAIL_PAGE);
    if(Y.Lang.isNull(display)) { return; }

    //Against my better judgement, styles need to go inline.
    //Netflix is doing some funky on page load, so my .css gets clobbered.
    var buttonHTML = '<a class="netflixq" style="border-radius: 3px;background-color: #000;color: #fff;cursor: pointer;display: inline-block; font-size: 1.1em;font-weight: bold;margin-bottom: 7px;margin-top: 7px;padding: 6px;">netflix<span class="q" style="color: #ae1d00;">Q</span></a>';
    
    display.insert(buttonHTML);
    
    display.delegate('click', function(e) {
        e.halt();

        var link = Y.one('div.displayPagePlayable a')
            ,title = e.container.one('h1.title').get('innerText')
            ,url = window.location.href
            ;

        var movie = {
            "id": extractid(link.get('href'))
            ,"title": title
            ,"url": url
        };

        saveMovie(movie);
        animButton(e.currentTarget);
    }, selectors.BUTTON_NETFLIXQ);
    
    
};

var grids = function() {

    var movies = Y.all('div.agMovie span.boxShot');
    // if(Y.Lang.isNull(display)) { return; }
    var buttonHTML = '<a class="netflixq" style="border-color: #fff; border-radius: 3px; border-width: 1px; background-color: #000;color: #fff;cursor: pointer;display: block; font-size: 1.1em;font-weight: bold;margin-bottom: 7px;margin-top: 7px;padding: 6px; position: absolute;bottom: 0;right: 0;z-index:14;">netflix<span class="q" style="color: #ae1d00;">Q</span></a>';
    
    movies.insert(buttonHTML);
    Y.one('body').delegate('click', function(e) {
        e.halt();

        var link = e.currentTarget.ancestor('span.boxShot').one('a.popLink')
            ,movie = {
                "id": extractid(link.get('href'))
                ,"title": e.currentTarget.ancestor('span.boxShot').one('img').get('alt')
                ,"url": link.get('href')
            };
        
        saveMovie(movie);
        animButton(e.currentTarget);
    }, selectors.BUTTON_NETFLIXQ);

};

var init = function() {
    
    detailPage();
    grids();
    
    //Add in the netflixQ button
    // Y.all(selectors.PLAY_WRAPPER).insert(button);

    //Handle the Sliders.
    //This is kinda tricky. Its laoding the panels ajax, so I need to know when the 
    //xhr has finished, and not quite sure how to do it? Open to suggestions plz
    //in the mean time, it's a hack.

/*
    var sliderContainer = Y.one('.mrows');
    if(!Y.Lang.isNull(sliderContainer)) {
        sliderContainer.delegate('click', function(e) {
            //Assume the request comes in :) 
            //there must be a better way to do this?
            Y.later(2000, {}, function(sliderParent) {
                var pane = sliderParent.one('.qSlider-currentPane');
                //If a netflix button is found in the container, then we know its already been modded
                if(Y.Lang.isNull(pane.one(selectors.BUTTON_NETFLIXQ))) {
                    pane.all(selectors.PLAY_WRAPPER).insert(button);
                }

            }, [e.currentTarget.ancestor('.qSlider')]);

        }, '.qSlider-navNext,.qSlider-navPrev');
    };
*/
/*

    Y.one(selectors.BUTTONS_CONTAINER).delegate('click', function(e) {

        var row = e.target.ancestor('.agMovie');

        //Will use titleEl as an indicator of which page we on
        //If it come back null, we know we on one of the listing pages. 
        //otherwise, we on a moview view page
        var titleEl = Y.one('h2.title'),
            link,
            title,
            url;

        //Listing, Grid, page
        if( Y.Lang.isNull(titleEl) ) {
            link = row.one('a.playLink');
            title = row.one('.boxShotImg').get('alt');
            url = link.get('href');
        } 
        else { //Movie View Page
            link = row.one('a.btn-play');
            title = titleEl.get('innerText');
            url = window.location.href;
        }

        var movie = {
            "id": extractid(link.get('id')),
            "title": title,
            "url": url
        };

        chrome.extension.sendMessage(movie, function(response) {
            //Disable/remove the button?.
            window.console.log(response);
            console.log(chrome.extension.lastError);
        });
        
        var toAnim = e.currentTarget.cloneNode(true)
            .setStyles({
                display: "block",
                position:"absolute",
                width: e.currentTarget.getComputedStyle('width'), 
                height: e.currentTarget.getComputedStyle('height'), 
                top: e.currentTarget.getY(),
                left: e.currentTarget.getX()
            });

        Y.one("body").append(toAnim);

        toAnim.transition({
            duration: 1, // seconds
            easing: 'ease-out-strong',
            top: e.currentTarget.get('docScrollY')+'PX',
            left: e.currentTarget.get('winWidth')+'PX',
            height: 0,
            width: 0,
            opacity: 0
        });

    }, selectors.BUTTON_NETFLIXQ);
*/

};

init();
    
});
