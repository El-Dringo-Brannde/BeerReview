var beer = require('./../Schemas/models.js');
var fs = require('fs');
var busboy = require('connect-busboy');

var FileUpload = require('express-fileupload');
var lwip = require('lwip');


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

    app.get('/addbeer', function(req, res) {
        beer.find(function(err, beers) { //find all beers
            if (err)
                res.send(err)
            res.json(beers);
        });
    });


    app.get('/Uploads/:picture', function(req, res) {
        console.log(req.params);
        var ToEdit = "./Uploads/" + req.params.picture + ".jpg";
        console.log("Going to edit " + ToEdit);
        lwip.open(ToEdit, function(err, image) {
            if (err)
                throw (err);
            else {
                image.resize(200, 200, //dimensions of what the picture is going to be displayed as
                    function(err, resizedImg) {
                        var test = ToEdit.substr(10, 100); //grab only the file name, which is the BeerName
                        var small_pic = "./Uploads/small_pic_" + test;
                        //^^ Rename the photos
                        image.rotate(90, 'white', function(err, image) {
                            resizedImg.writeFile(small_pic, function(err) {
                                if (err)
                                    throw err;
                                res.sendfile(small_pic);
                            });
                        })
                    })
            }

        })
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
