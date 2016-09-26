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

var app = express();
app.use(express.static('public'));


// GET https://api.spotify.com/v1/artists/{id}/related-artists
app.get('/search/:name', function(req, res) {
    var searchReq = getFromApi('search', {
        q: req.params.name,
        limit: 1,
        type: 'artist'
    });
    searchReq.on('end', function(item) {
        var artist = item.artists.items[0];
        var id = artist.id;
        var related = getRelated(id);
        related.on('end', function(item){
            for (var artistNumber in item.artists){
                console.log(item.artists[artistNumber].name);
            }
        });
        // res.json(artist);
    });
    


    searchReq.on('error', function(code) {
        res.sendStatus(code);
    });
});


app.listen(process.env.PORT || 8080);


