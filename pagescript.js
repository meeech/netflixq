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

var createButton = function(extraStyles) {
    
    extraStyles = extraStyles || {};
    
    var styles = Y.merge({
        "border-radius": "3px"
        ,"background-color": "#000"
        ,"color": "#fff"
        ,"cursor": "pointer"
        ,"display": "inline-block"
        ,"font-size": "1.1em"
        ,"font-weight": "bold"
        ,"margin-bottom": "7px"
        ,"margin-top": "7px"
        ,"padding": "6px"
    }, extraStyles);
    
    //styles need to go inline.
    //Netflix is doing some funky on page load, so my .css gets clobbered, even with !important
    return Y.Node.create('<a class="'+selectors.BUTTON_NETFLIXQ+'">netflix<span class="q" style="color: #ae1d00;">Q</span></a>')
        .setStyles(styles);
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

    display.insert(createButton());
    
    display.delegate('click', function(e) {
        e.halt();

        var link = Y.one('div.displayPagePlayable a')
            ,movie = {
                "id": extractid(link.get('href'))
                ,"title": e.container.one('h1.title').get('innerText')
                ,"url": link.get('href')
            };

        saveMovie(movie);
        animButton(e.currentTarget);
    }, selectors.BUTTON_NETFLIXQ);
    
    
};

var grids = function() {

    var movies = Y.all('div.agMovie span.boxShot');
    
    var button = createButton({"position": "absolute", "bottom": 0, "right": 0, "z-index": 14});

    //Pass in string fragment, since passing in a dom element doesn't work - can only have one instance
    //and insert doesn't clone it.
    movies.insert(button.get('outerHTML'));
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
};

init();
    
});
