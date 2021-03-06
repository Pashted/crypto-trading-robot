export let

    setTitle = title =>
        document.title = title + ' - TradeBot',


    /**
     * Makes {name:value} object from dom's event
     * @param name
     * @param value
     */
    getParam = ({ target: { name, value } }) => {
        let param = {};
        param[name] = value;
        return param;
    },


    /**
     * Swaps theme styles
     * @param theme
     */
    setTheme = theme => {
        let stylesheet = [].filter.call(document.getElementsByTagName('link'), el => el.rel === 'stylesheet')[0];

        stylesheet.href = `/styles/${theme}.css`;
    };


/**
 * Simple object check.
 * @param item
 * @returns {*|boolean}
 */
function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}


/**
 * Deep merge two objects.
 * @param target
 * @param sources
 * @returns {*}
 */
export function mergeDeep(target, ...sources) {
    if (!sources.length)
        return target;

    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (!source.hasOwnProperty(key))
                continue;

            if (isObject(source[key])) {
                if (!target[key])
                    Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);

            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}


/**
 * Apply filter with allowed key names to the object
 * @param source {Object}
 * @param filter {Array}
 * @returns {{}}
 */
export function filterObject(source, filter) {
    return Object.keys(source)
        .filter(key => filter.includes(key))
        .reduce(
            (obj, key) => ({
                ...obj, [key]: source[key]
            }),
            {}
        );
}
