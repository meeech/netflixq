Y.use('node', function(Y) {

var selectors = {
    Q_LIST: '#netflixq',
    REMOVE_TARGET: 'img.remove'
};

var lStore = (('localStorage' in window) && window['localStorage'] !== null) ? window.localStorage : false ;

function getList() {
    return JSON.parse(lStore.getItem('NetflixQList'));
}

function saveList (toSave) {
    lStore.setItem('NetflixQList', JSON.stringify(toSave));
}

var movies = [],
    movieTemp = '<div class="movie" id="{id}"><img width="16" height="16" class="remove" src="no.png"><a target="_blank" href="{url}">{title}</a></div>';

Y.each(getList(), function(v,k) {
    v.id = k;
    movies.push(Y.Lang.sub(movieTemp, v));
});

if(movies.length > 0) {
    Y.one(selectors.Q_LIST).setContent(movies.join(''));
}

//Clicks on the remove box
Y.one(selectors.Q_LIST).delegate('click', function(e) {
    var toRemove = e.target.ancestor('div');
    var nq = getList();

    if(!Y.Lang.isNull(nq)) {
        delete nq[toRemove.get('id')];
    }
    saveList(nq);

    toRemove.transition({
        duration: 0.3, // seconds
        // easing: 'ease-out',
        height: 0,
        padding: 0,
        opacity: 0
    }, function() {
        toRemove.remove().destroy(); 
    });

}, selectors.REMOVE_TARGET);


});
