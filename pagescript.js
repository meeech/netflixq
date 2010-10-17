Y.use('node', function(Y) {

var selectors = {
    PLAY_WRAPPER: '.btnWrap',
    BUTTONS_CONTAINER: '.main-content',
    BUTTON_NETFLIXQ: '.netflixq'
};

var button = '<a class="netflixq btn {btn-size} watchlk">netflixq</a>';

// netflix creates some ids like m70102568_0, m70102568_1 and so forth for different elements
// in the page for a particular movie. use this to extract the uuid part.
var extractid = function(id) {
    return id.slice(0, id.lastIndexOf('_'));        
};

var init = function() {
    //Add in the netflixQ button
    Y.all(selectors.PLAY_WRAPPER).filter(':not(.mltBtn-trailer)').insert(button);

    Y.one(selectors.BUTTONS_CONTAINER).delegate('click', function(e) {

        //@todo clone and animate to show click.
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

    }, selectors.BUTTON_NETFLIXQ);
};

init();
    
});
