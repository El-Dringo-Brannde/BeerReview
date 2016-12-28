var mongoose = require('mongoose');
module.exports = mongoose.model('Beer', {
    BeerName: String,
    Brewer: String,
    Type: String,
    Appearance: String,
    Smell: String,
    Taste: String,
    BuyAgain: String
});
