const fs = require('fs'),
    dir = fs.readdirSync(__dirname);

// list of available exchanges models
let exchanges = [];

dir.forEach(file => {

    let path = `${__dirname}/${file}`;

    if (fs.lstatSync(path).isDirectory())
        exchanges.push(file);

});

module.exports = exchanges;