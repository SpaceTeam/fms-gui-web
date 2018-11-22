const http = require('http');
const config = require('./config/server-config');

// Create the server object
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    console.log("Request accepted");        // Got request
    console.log("Request at: " + req.url);  // Print url at which the server got the request
    res.end();
}).listen(config.getPort());    // Listens on the specified port