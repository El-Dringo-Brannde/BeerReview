var express = require('express')
var app = express()

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));


var morgan = require('morgan');
app.use(morgan('dev'));
var mongoose = require('mongoose');

var url = 'mongodb://localhost:27017/LearnMean';

mongoose.connect(url, function() {
    console.log("Connected to DB");
});


require('./routes.js')(app);

app.listen(3000, function() {
    console.log("Listening on port 3000...");
});
