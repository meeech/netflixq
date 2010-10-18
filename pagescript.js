Y.use('node', function(Y) {

var selectors = {
    PLAY_WRAPPER: '.btnWrap',
    BUTTONS_CONTAINER: '.main-content',
    BUTTON_NETFLIXQ: '.netflixq'
};

var button = '<a class="netflixq btn watchlk">netflix<span class="q">Q</span></a>';

// netflix creates some ids like m70102568_0, m70102568_1 and so forth for different elements
// in the page for a particular movie. use this to extract the uuid part.
var extractid = function(id) {
    return id.slice(0, id.lastIndexOf('_'));        
};

var init = function() {
    //Add in the netflixQ button
    Y.all(selectors.PLAY_WRAPPER).filter(':not(.mltBtn-trailer)').insert(button);

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
            link = row.one('.title a');
            title = link.get('innerText');
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

        chrome.extension.sendRequest(movie, function(response) {
            //Disable/remove the button?.
            // window.console.log(response);
        });
        
        //@todo clone and animate to show click.
        //Aaaand anumate the button.
        var toAnim = e.target.cloneNode(true)
            .setStyles({
                display: "block",
                position:"absolute",
                width: e.target.getComputedStyle('width'), 
                height: e.target.getComputedStyle('height'), 
                top: e.target.getY(),
                left: e.target.getX()
            });

        Y.one("body").append(toAnim);

        toAnim.transition({
            duration: 2, // seconds
            easing: 'bounce-out',
            top: 0,
            left: e.target.get('winWidth')+'PX',
            height: 0,
            width: 0,
            opacity: 0
        });

    }, selectors.BUTTON_NETFLIXQ);
};

init();
    
});
