const webpack = require('webpack');

module.exports = {
    mode:    'development',
    context: __dirname,
    devtool: "source-map",
    entry:   "./public/javascripts/src/index.js",
    resolve: {
        alias: {
            'uikit-icons': '../../../node_modules/uikit/dist/js/uikit-icons',
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
        path:     __dirname + "/public/javascripts",
        filename: "bundle.js"
    }
};