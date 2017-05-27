var express = require('express')
var app = express()

var bodyParser = require('body-parser');
var multer = require('multer');
var lwip = require('lwip');


app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Methods", "POST,PUT,OPTIONS,DELETE,GET");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({
    'extended': 'true'
}));

app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './Uploads/');
    },
    filename: function(req, file, callback) {
        console.log("FILE NAME: " + req.body.Name);
        //This callback actually writes the file on the server
        callback(null, req.body.Name + ".jpg");
    }
});

var upload = multer({
    storage: storage
}).single('file');

var morgan = require('morgan');
app.use(morgan('dev'));
var mongoose = require('mongoose');

var url = 'mongodb://10.0.0.10:12345/LearnMean';

mongoose.connect(url, function() {
    console.log("Connected to DB, bitch");
});

app.get('/Uploads/:picture', function(req, res) {
    console.log("HERE!!" + req.params);
    var ToEdit = "./Uploads/" + req.params.picture;
    console.log("Going to edit " + ToEdit);
    try {
        lwip.open(ToEdit, function(err, image) {
            if (err)
                console.log(err);
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

        });
    } catch (err) {
        console.log(err);
    }
});

require('./routes.js')(app); //require and call routes file

app.listen(3000, function() {
    console.log("Listening on port 3000...");
});
