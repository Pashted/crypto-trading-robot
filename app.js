var createError = require('http-errors');
var express = require('express');
var path = require('path'),
    cookieParser = require('cookie-parser'),
// var lessMiddleware = require('less-middleware');
    logger = require('morgan'),

    indexRouter = require('./routes/index'),
    settingsRouter = require('./routes/settings'),
    tradingRouter = require('./routes/trading'),
    helpRouter = require('./routes/help'),

    app = express(),

    defaults = require('./model/defaults');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/settings/', settingsRouter);
app.use('/trading/', tradingRouter);
app.use('/help/', helpRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', { defaults });
});

module.exports = app;
