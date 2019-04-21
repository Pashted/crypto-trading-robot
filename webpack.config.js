const webpack = require('webpack'),
    path = require('path');

console.log('process.NODE_ENV', process.env.NODE_ENV);

module.exports = {
    context:      path.resolve('./public/javascripts/src/pages'),
    mode:         process.env.NODE_ENV || 'development',
    devtool:      "source-map",
    entry:        {
        home:     './home.js',
        trading:  './trading.js',
        settings: './settings.js',
        help:     './help.js',
    },
    resolve:      {
        alias: {
            'uikit-icons': path.resolve('./node_modules/uikit/dist/js/uikit-icons'),
        }
    },
    plugins:      [
        new webpack.ProvidePlugin({
            $:               'jquery',
            jQuery:          'jquery',
            "window.jQuery": 'jquery'
        }),
        new webpack.ProvidePlugin({
            UIkit: 'uikit'
        })
    ],
    output:       {
        path: path.resolve('./public/javascripts/dist')
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                bundle: {
                    chunks:  'initial',
                    name:    'bundle',
                    test:    /node_modules/,
                    enforce: true
                }
            }
        }
    }
};