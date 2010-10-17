Y.use('node', function(Y) {

    var selectors = {
        PLAY_WRAPPER: '.btnWrap',
        BUTTONS_CONTAINER: '.agMovieSet',
        BUTTON_NETFLIXQ: '.netflixq'
    };

    var button = '<div class="netflixq btn btn-30 watchlk">netflixq</div>';

    var init = function() {

        Y.all(selectors.PLAY_WRAPPER).insert(button);

        //Delegate to catch all netflixq clicks
        Y.one(selectors.BUTTONS_CONTAINER).delegate('click', function(e) {
            //Movie Grid
            //agMovieSet agMovieGrid agMovieGridCol5
            //div.agMovie

            //Movie Table
            //agMovieSet agMovieTable
            //tr.agMovie
            var row = e.target.ancestor('.agMovie');
            var link = row.one('.title a');
            var movie = {
                id: link.get('id'),
                title: link.get('innerText'),
                url: link.get('href')
            };
            // window.console.log(movie);
            chrome.extension.sendRequest(movie, function(response) {
                window.console.log(response);
            });
            
        }, selectors.BUTTON_NETFLIXQ);
        
        //Y.all('.btnWrap').setContent('test!');
        // window.console.log(Y.all('.btnWrap'));
        // alert(window.document.title);
    };

    init();
    
});

