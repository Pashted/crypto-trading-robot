// add timestamps in front of log messages
require('console-stamp')(console, {
    pattern: ' HH:MM:ss.l ',
    label:   false
});

require('util').inspect.defaultOptions = {
    depth:          1,
    maxArrayLength: 10,
    compact:        true
};

const express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    // logger = require('morgan'),

    indexRouter = require('./routes/index'),

    app = express();

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

module.exports = app;
