var unirest = require('unirest');
var express = require('express');
var events = require('events');



var getFromApi = function(endpoint, args) {
    var emitter = new events.EventEmitter();
    // id = '0LcJLqbBmaGUft1e9Mm8HV';
    unirest.get('https://api.spotify.com/v1/' + endpoint)
           .qs(args)
           .end(function(response) {
            // console.log(response.body.artists.items[0].id);
                if (response.ok) {
                    emitter.emit('end', response.body);
                }
                else {
                    emitter.emit('error', response.code);
                }
            });
    return emitter;
};

//second call to api below
var getRelated = function( id ) {
    var emitter = new events.EventEmitter();
    unirest.get('https://api.spotify.com/v1/artists/' + id + '/related-artists')
    .end(function(response){
        if (response.ok) {
            emitter.emit('end', response.body);
        } else {
            emitter.emit('error', response.code);
        }
    });
    return emitter;
};

//third call to api for top tracks
var getTop = function( id ) {
    var emitter = new events.EventEmitter();
    unirest.get('https://api.spotify.com/v1/artists/' + id + '/top-tracks')
    .qs({country: 'us'})
    .end(function(response){
        if (response.ok) {
            emitter.emit('end', response.body);
        } else {
            emitter.emit('error', response.code);
        }
    });
    return emitter;
};


var app = express();
app.use(express.static('public'));


// GET https://api.spotify.com/v1/artists/{id}/related-artists 
app.get('/search/:name', function(req, res) {
    var searchReq = getFromApi('search', {
        q: req.params.name,
        limit: 1,
        type: 'artist'
    });
    //emit artist
    searchReq.on('end', function(item) {
        var artist = item.artists.items[0];
        var id = artist.id;
            //emit related artists
            var related = getRelated(id);
            related.on('end', function(data){
                artist.related = data.artists;

                var count = 0;
                var completed = artist.related.length;

                artist.related.forEach(function(argument){
                    var topTracks = new getTop(argument.id);
                    topTracks.on('end', function(topSongs){
                        argument.tracks = topSongs.tracks;
                        count++;
                        if (count === completed) {
                            res.json(artist);
                        }
                    });
                });
            }); 
    });
    


    searchReq.on('error', function(code) {
        res.sendStatus(code);
    });
});


app.listen(process.env.PORT || 8080);


