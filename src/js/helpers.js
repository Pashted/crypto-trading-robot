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