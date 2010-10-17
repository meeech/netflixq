Y.use('node', function(Y) {

    var button = '<div class="netflixq btn btn-40 watchlk">netflixq</div>';

    var init = function() {
        
        Y.all('.btnWrap').insert(button);
        
        //Y.all('.btnWrap').setContent('test!');
        // window.console.log(Y.all('.btnWrap'));
        // alert(window.document.title);
    };

    init();
    
});

