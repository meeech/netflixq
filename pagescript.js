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
            //e.currentTarget -  defined target element - one we looking for
            //e.target - The element that was really clicked
            //e.container - the node we delegated on
            //Figure out what was clicked. 
            
            // Movie Grid
            // agMovieSet agMovieGrid agMovieGridCol5
            //div.agMovie
            //Movie Table
            //agMovieSet agMovieTable
            // tr.agMovie
            var row = e.target.ancestor('.agMovie');
            var link = row.one('.title a');
            var movie = {
                id: link.get('id'),
                title: link.get('innerText'),
                url: link.get('href')
            };
            
            
            window.console.log(link);
            window.console.log(movie);
            
            //Post message 
        }, selectors.BUTTON_NETFLIXQ);
        
        //Y.all('.btnWrap').setContent('test!');
        // window.console.log(Y.all('.btnWrap'));
        // alert(window.document.title);
    };

    init();
    
});

