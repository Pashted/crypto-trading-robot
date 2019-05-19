const presets = [
        "@babel/preset-env",
        "@babel/preset-react"
    ],
    plugins = [
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-transform-runtime",
    ];

module.exports = function (api) {
    api.cache(true);

    return { presets, plugins };
};