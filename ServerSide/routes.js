var beer = require('./../Schemas/models.js');
var fs = require('fs');
var lwip = require('lwip');


//Export these routes to the index.js file
module.exports = function(server) {
    server.register(require('inert'), (err) => {
        if (err)
            throw err;
        server.route({
            method: "post",
            path: "/addbeer",
            handler: (req, res) => {
                console.log("In add beer " + req.payload.BeerName);
                var FileLocation = "./ServerSide/Uploads/" + req.payload.BeerName + ".jpg";
                console.log(FileLocation);
                beer.create({
                    BeerName: req.payload.BeerName,
                    Brewer: req.payload.Brewer,
                    Type: req.payload.Type,
                    Appearance: req.payload.Appearance,
                    Smell: req.payload.Smell,
                    Rating: req.payload.Rating,
                    Taste: req.payload.Taste,
                    BuyAgain: req.payload.BuyAgain,
                    PathToImage: FileLocation
                });
            }
        });

        server.route({
            method: "post",
            path: "/upload",
            config: {
                payload:{
                    maxBytes: 209715200,
                    output:'stream',
                    parse: true,
                    allow: "multipart/form-data"
                }
            },
            handler: function (request, reply) {
                var data = request.payload;
                if (data.file) {
                    var name = data.file.hapi.filename;
                    var path = __dirname + "/uploads/" + name;
                    var file = fs.createWriteStream(path);

                    file.on('error', function (err) {
                        console.error(err)
                    });

                    data.file.pipe(file);

                    data.file.on('end', function (err) {
                        var ret = {
                            filename: data.file.hapi.filename,
                            headers: data.file.hapi.headers
                        }
                        reply(JSON.stringify(ret));
                    })
                }

            }
        });



        server.route({
            method: "get",
            path: "/AddBeer.html",
            handler: function(req, res) {
                console.log("Here");
                res.file("./ClientSide/AddBeer.html");
            }
        });

        server.route({
            method: "get",
            path: "/fileUpload/{file}",
            handler: (req,res) =>{
                res.file("./node_modules/ng-file-upload/dist/" + req.params.file)
            }
        });

        server.route({
            method: "get",
            path: "/getbeer",
            handler: (req,res) =>{
                beer.find(function(err, beers) {
                    console.log(beers);
                    if (err)
                        res.send(err);
                    res(beers);
                });
            }
        });

        server.route({
            method: "get",
            path: "/ServerSide/Uploads/{picture}",
            handler: function(req, res) {
                console.log("HERE!!" + JSON.stringify(req.params));
                var ToEdit = "./ServerSide/Uploads/" + req.params.picture;
                console.log("Going to edit " + ToEdit);
                lwip.open(ToEdit, function(err, image) {
                    if (err)
                        console.log(err);
                    else {
                        image.resize(200, 200, //dimensions of what the picture is going to be displayed as
                            function(err, resizedImg) {
                                var test = ToEdit.substr(21, 100); //grab only the file name, which is the BeerName
                                var small_pic = "./ServerSide/Uploads/small_pic_" + test;
                                //^^ Rename the photos
                                image.rotate(90, 'white', function(err, image) {
                                    resizedImg.writeFile(small_pic, function(err) {
                                        if (err)
                                            throw err;
                                        res.file(small_pic);
                                    });
                                })
                            })
                    }
                });
            }
        });
        server.route({
            method: "get",
            path: "/previousBeers.html",
            handler: function(req, res) {
                console.log("Here");
                res.file("./ClientSide/previousBeers.html");
            }
        });
        server.route({
            method: "GET",
            path: "/dependencies/{file}",
            handler: (req, res) => {
                res.file("./ClientSide/" + req.params.file);
            }
        });
        server.route({
            method: "GET",
            path: "/",
            handler: (req, res) => {
                res.file("./ClientSide/base.html")
            }
        });
    });

};
