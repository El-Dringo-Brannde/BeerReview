var express = require('express')
var app = express()

var bodyParser = require('body-parser');
var multer = require('multer');

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
        console.log(req.body.Name);
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

var url = 'mongodb://localhost:27017/LearnMean';

mongoose.connect(url, function() {
    console.log("Connected to DB");
});

app.post('/upload', function(req, res) {
    console.log("On the serverside");
    console.log(req.body);
    upload(req, res, function(err) {
        if (err) {
            res.json({
                error_code: 1,
                err_desc: err
            });
            return;
        }
        res.json({
            error_code: 0,
            err_desc: null
        });
    });
});


require('./routes.js')(app); //require and call routes file

app.listen(3000, function() {
    console.log("Listening on port 3000...");
});
