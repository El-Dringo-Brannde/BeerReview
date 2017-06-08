var mongoose = require('mongoose');
console.log("In the userSchema file. ");
module.exports = mongoose.model('User', {
    Username: String,
    Password: String
});
