var beer = require('./../Schemas/models.js');
var fs = require('fs');
var busboy = require('connect-busboy');

var FileUpload = require('express-fileupload');


//Export these routes to the index.js file
module.exports = function(app) {
    app.use(busboy());
    app.use(FileUpload());

    app.post('/addbeer', function(req, res) {
        console.log(JSON.stringify(req.body));
        console.log("In add beer " + req.body.BeerName);
        console.log("Path to file: " + "./Uploads/" + req.body.BeerName);
        var FileLocation = "./Uploads/" + req.body.BeerName;
        beer.create({
            BeerName: req.body.BeerName,
            Brewer: req.body.Brewer,
            Type: req.body.Type,
            Appearance: req.body.Appearance,
            Smell: req.body.Smell,
            Rating: req.body.Rating,
            Taste: req.body.Taste,
            BuyAgain: req.body.BuyAgain,
            PathToImage: FileLocation
        }, function(err) {
            if (err)
                res.send(err);
        });
    });

    app.post('/upload', function(req, res) {
        var fstream;
        console.log("I'm in shit", req);
        req.pipe(req.busboy);
        console.log("Doing Stuff..");
        var file = req.files.file;
        console.log(file);
        file.mv("./Uploads/fuck.png", function(err) {
            if (err) {
                console.log("Oh nose!", err);
                res.send(err);
            } else {
                console.log("SUCCESS!");
                res.send(0);
            }
        })
    });


    app.get('/addbeer', function(req, res) {
        beer.find(function(err, beers) {
            console.log(beers);
            if (err)
                res.send(err)
            res.json(beers);
        });
    });






    // -------------------------- Serving external JS Files ----------------------
    app.get('/ng-file-upload.min.js', function(req, res) {
        res.sendfile('ng-file-upload.min.js', {
            root: "./../node_modules/ng-file-upload/dist/"
        });
    });
    app.get('/ng-file-upload-shim.min.js', function(req, res) {
        res.sendfile('ng-file-upload-shim.min.js', {
            root: "./../node_modules/ng-file-upload/dist/"
        });
    });

    app.get('/controller.js', function(req, res) {
        res.sendfile('controller.js', {
            root: "./../ClientSide/"
        });
    });

    app.get('/', function(req, res) {
        res.sendfile('home.html', {
            root: "./../ClientSide/"
        });
    });

};
