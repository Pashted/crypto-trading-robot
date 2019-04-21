/**
 * Making object form a jQuery form element
 * @param form
 * @returns {string}
 */

export let serializeJSON = function (form) {
    let result = {};

    form.serialize()
        .split('&')
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