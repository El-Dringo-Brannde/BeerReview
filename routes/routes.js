console.log("I'm in the new directory");
var beer = require('./Schemas/models.js');

//Export these routes to the index.js file
module.exports = function(app) {

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
	    Photo: req.body.Picture,
            BuyAgain: req.body.BuyAgain
        }, function(err) {
            if (err)
                res.send(err);
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
        res.sendfile('./routes/Views/controller.js');
    });

    app.get('/', function(req, res) {
        res.sendfile('./routes/Views/home.html');
    });

};
