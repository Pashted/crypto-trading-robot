/**
 * Making object form a query string
 * @param data
 * @returns {string}
 */

export let serializeJSON = function (data) {
    let result = {};

    data.split('&')
        .forEach(value => {
            let arr = value.split('=');

            switch (typeof result[arr[0]]) {
                case 'string':
                    result[arr[0]] = [result[arr[0]], arr[1]];
                    break;

                case 'object':
                    result[arr[0]].push(arr[1]);
                    break;

                default:
                    result[arr[0]] = arr[1];
            }

        });

    return JSON.stringify(result);
};