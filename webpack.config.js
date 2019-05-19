const path = require('path'),
    webpack = require('webpack'),
    CopyPlugin = require('copy-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

let dev = true;

process.argv.forEach(param => {
    // если webpack запущен с командой --mode production
    if (param === 'production')
        dev = false;
});


module.exports = {
    devtool: dev && 'source-map',
    context: path.resolve('./src/js/'),
    entry:   { main: './index.js' },

    output: {
        filename: 'scripts/[name].js',
        path:     path.resolve('./public'),
    },

    resolve: {
        alias: {
            'uikit-icons': path.resolve('./node_modules/uikit/dist/js/uikit-icons'),
        }
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    chunks:  'initial',
                    name:    'vendors',
                    test:    /node_modules/,
                    enforce: true
                }
            }
        }
    },

    plugins: [
        new webpack.ProvidePlugin({
            UIkit:          'uikit',
            "window.UIkit": 'uikit'
        }),

        new CopyPlugin([
            { from: '../icons', to: './images/icons/' }
        ]),

        new ExtractTextPlugin('styles/template.css')
    ],

    module: {
        rules: [
            {
                test:    /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use:     { loader: "babel-loader" }
            },
            {
                test: /\.less$/,
                use:  ExtractTextPlugin.extract({
                    fallback:   'style-loader',
                    publicPath: '/',
                    use:        [
                        { loader: 'css-loader', options: { sourceMap: true } },
                        { loader: 'postcss-loader' },
                        { loader: 'less-loader', options: { sourceMap: true } }
                    ],
                })
            },
            {
                test:    /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader:  "url-loader",
                options: {
                    outputPath: "fonts",
                    name:       "[name].[ext]",
                    mimetype:   "application/font-woff",
                    limit:      10000,
                }
            },
            {
                test:    /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader:  "file-loader",
                options: {
                    outputPath: 'fonts',
                    name:       "[name].[ext]"
                }
            },
            {
                test:    /\.(jpe?g|png)$/i,
                loader:  'file-loader',
                options: {
                    outputPath: 'images'
                }

            }
        ]
    }

};
