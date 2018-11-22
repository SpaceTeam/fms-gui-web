const yaml = require('js-yaml');
const fs = require('fs');

let config = {};
try {
    config = yaml.safeLoad(fs.readFileSync('./config/server.yml', 'utf8'));
} catch(e) {
    console.log(e);
}

exports.getPort = function() {
    return config.port;
};