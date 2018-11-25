/**
 * This file manages the server.yml file and lets the user read its properties for further use
 */

const yaml = require('js-yaml');
const fs = require('fs');

let config = {};
try {
    config = yaml.safeLoad(fs.readFileSync('./config/server.yml', 'utf8'));
} catch(e) {
    console.log("Error: " + e);
}

exports.getPort = function() {
    return config.port;
};