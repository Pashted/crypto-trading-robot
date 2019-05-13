module.exports = {
    sourceMap: true,
    plugins:   [
        require('autoprefixer')({
            browsers: [
                'ie >= 10',
                'last 2 version'
            ]
        }),
        require('cssnano')
    ]
};