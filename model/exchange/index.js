const fs = require('fs'),
    dir = fs.readdirSync(__dirname);

// list of available exchanges models
let exchanges = {
    "_list": []
};

dir.forEach(file => {

    let path = `${__dirname}/${file}`;

    if (fs.lstatSync(path).isDirectory()) {

        exchanges._list.push(file);
        exchanges[file] = require(path);
    }
});

module.exports = exchanges;