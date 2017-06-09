var beer = require('./../Schemas/beerSchema.js');
var user = require('./../Schemas/userSchema.js');
var fs = require('fs');
var lwip = require('lwip');
var cookies = require("cookies");

//Export these routes to the index.js file
module.exports = function(server) {
    server.register(require('inert', 'cookie'), (err) => {
        if (err)
            throw err;
        server.route({
            method: "post",
            path: "/addbeer",
            handler: (req, res) => {
                console.log("In add beer " + req.payload.BeerName);
                console.log(req.state);
                var FileLocation = "./ServerSide/Uploads/" + req.payload.BeerName + ".jpg";
                console.log(FileLocation);
                beer.create({
                    User: req.state.user,
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


        function isEmpty(obj) {
            // null and undefined are "empty"
            if (obj == null) return true;
            // Assume if it has a length property with a non-zero value
            // that that property is correct.
            if (obj.length > 0) return false;
            if (obj.length === 0) return true;
            // If it isn't an object at this point
            // it is empty, but it can't be anything *but* empty
            // Is it empty?  Depends on your application.
            if (typeof obj !== "object") return true;
            // Otherwise, does it have any properties of its own?
            // Note that this doesn't handle
            // toString and valueOf enumeration bugs in IE < 9
            for (var key in obj) {
                if (hasOwnProperty.call(obj, key)) return false;
            }
            return true;
        }

        server.route({
            method: "post",
            path: "/upload",
            config: {
                payload: {
                    maxBytes: 209715200,
                    output: 'stream',
                    parse: true,
                    allow: "multipart/form-data"
                }
            },
            handler: function(request, reply) {
                var data = request.payload;
                if (data.file) {
                    var path = __dirname + "/Uploads/" + data.Name + ".jpg";
                    var file = fs.createWriteStream(path);
                    file.on('error', function(err) {
                        reply(err);
                    });
                    data.file.pipe(file);
                    data.file.on('end', function(err) {
                        reply(0);
                    })
                }
            }
        });

        server.route({
            method:"get",
            path:"/checkCookie",
            handler: function(req,res){
                console.log(req.state);
                if (isEmpty(req.state) === true)
                    res(false);
                else
                    res(true);
            }
        });




        server.route({
            method: "get",
            path: "/fileUpload/{file}",
            handler: (req, res) => {
                res.file("./node_modules/ng-file-upload/dist/" + req.params.file)
            }
        });

        server.route({
            method: "get",
            path: "/getbeer",
            handler: (req, res) => {
                beer.find({"User":req.state.user}).sort({
                    _id: -1
                }).exec(function(err, beers) {
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
            method: "post",
            path: "/addUser",
            handler: function(req, res) {
                var data = req.payload;
                console.log(data);
                user.create({
                    Username: data.username,
                    Password: data.pass
                });
                res(0).state("user", data.username);
            }
        });

        server.route({
            method:"post",
            path:"/checkLogin",
            handler: function(req,res){
                console.log(req.payload);
                user.find({
                    "Username": (req.payload.user).toString(),
                    "Password": (req.payload.password).toString()
                },
                    function(err,users){
                        if (users.length === 0)
                            res(-1);
                        else
                            res(0).state("user",req.payload.user);
                    });
            }
        });

        server.route({
            method: "post",
            path: "/checkNames",
            handler: function(req, res) {
                console.log(req.payload);
                if (req.payload.username == undefined) {
                    res(-1);
                    return
                }
                var data = (req.payload.username).toString();
                user.find({
                        "Username": data
                    },
                    function(err, users) {
                        console.log(users);
                        if (users.length !== 0)
                            res(-1);
                        else
                            res(0)
                    });
            }
        });
        server.route({
            method: "get",
            path: "/getUser",
            handler: function(req,res){
                res(req.state.user);
            }
        });


        server.route({
            method: "GET",
            path: "/dependencies/{file}",
            handler: (req, res) => {
                res.file("./dependencies/" + req.params.file);
            }
        });


        server.route({
            method: "get",
            path: "/AddBeer.html",
            handler: function(req, res) {
                res.file("./ClientSide/AddBeer.html");
            }
        });

        server.route({
            method: "get",
            path: "/previousBeers.html",
            handler: function(req, res) {
                res.file("./ClientSide/previousBeers.html");
            }
        });

        server.route({
            method: "get",
            path: "/home.html",
            handler: function(req, res) {
                res.file("./ClientSide/home.html");
            }
        });

        server.route({
            method: "get",
            path: "/login.html",
            handler: function(req, res) {
                res.file("./ClientSide/login.html");
            }
        });

        server.route({
            method: 'GET',
            path: '/',
            config: {
                handler: function(request, reply) {
                    reply.file("./ClientSide/base.html");
                }
            }
        })
    });

};
