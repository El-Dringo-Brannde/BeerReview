var mongoose = require('mongoose');
var url = 'mongodb://10.0.0.10:12345/LearnMean';
mongoose.connect(url, function() {
    console.log("Connected to DB");
});

const Hapi = require('hapi');
const server = new Hapi.Server();
server.connection({
    port: 3000,
    host: '10.0.0.10'
});

require('./ServerSide/routes.js')(server); //require and call routes file
server.start((err) => {
    if (err)
        throw err;
    else {
        console.log(`Server is up and running at ${server.info.uri}`);
    }
});
