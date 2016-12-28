var beer = require('./Schemas/models.js');
var fs = require('fs');
var busboy = require('connect-busboy');

//Export these routes to the index.js file
module.exports = function(app) {
    app.use(busboy());
    app.post('/addbeer', function(req, res) {
        console.log(JSON.stringify(req.body));
        console.log("In add beer " + req.body.BeerName);
        beer.create({
            BeerName: req.body.BeerName,
            Brewer: req.body.Brewer,
            Type: req.body.Type,
            Appearance: req.body.Appearance,
            Smell: req.body.Smell,
            Taste: req.body.Taste,
            BuyAgain: req.body.BuyAgain
        }, function(err) {
            if (err)
                res.send(err);
        });
    });

    app.post('/shit', function(req, res) {
        var fstream;
        console.log("I'm in shit");
        req.pipe(req.busboy);
        req.busboy.on('file', function(fieldname, file, filename) {
            console.log("Uploading: " + filename);
            fstream = fs.createWriteStream(__dirname + '/files/' + filename);
            file.pipe(fstream);
            fstream.on('close', function() {
                res.redirect('back');
            });
        });
    });


    app.get('/addbeer', function(req, res) {
        beer.find(function(err, beers) {
            if (err)
                res.send(err)
            res.json(beers);
        });
    });


    // Reroute everything to give JS file
    app.get('/controller.js', function(req, res) {
        res.sendfile('./Views/controller.js');
    });

    app.get('/', function(req, res) {
        res.sendfile('./Views/home.html');
    });

};
