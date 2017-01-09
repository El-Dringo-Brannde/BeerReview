var mongoose = require('mongoose');
console.log("In the models file. ");
module.exports = mongoose.model('Beer', {
    BeerName: String,
    Brewer: String,
    Type: String,
    Appearance: String,
    Smell: String,
    Taste: String,
    Rating: String,
    BuyAgain: String,
    PathToImage: String
});
