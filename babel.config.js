const presets = [
        "@babel/preset-env",
        "@babel/preset-react"
    ],
    plugins = [ "@babel/plugin-proposal-class-properties" ];

module.exports = function (api) {
    api.cache(true);

    return { presets, plugins };
};