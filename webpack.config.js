const webpack = require('webpack'),
    path = require('path');

module.exports = {
    context:  path.resolve('./public/javascripts/src/pages'),
    mode:    'development',
    devtool: "source-map",
    entry:   {
        home:     './home.js',
        trading:  './trading.js',
        settings: './settings.js',
        help:     './help.js',
    },
    resolve: {
        alias: {
            'uikit-icons': path.resolve('./node_modules/uikit/dist/js/uikit-icons'),
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            $:               'jquery',
            jQuery:          'jquery',
            "window.jQuery": 'jquery'
        }),
        new webpack.ProvidePlugin({
            UIkit: 'uikit'
        })
    ],
    output:  {
        path:     path.resolve('./public/javascripts/dist'),
        filename: "[name].js"
    }
};