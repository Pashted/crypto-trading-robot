import { serializeJSON as toJSON } from "./serializeJSON";

/**
 * Makes ajax queries to the server easier
 * @param method
 * @param empty_params
 * @returns {Promise}
 */
let query = (method, empty_params) => {
    console.log('>> RUN_ ' + method);

    let form = $('section form'),
        data = { method };

    if (!empty_params)
        data.params = toJSON(form.serialize());

    return new Promise(resolve => {

        $.ajax({
            url:      form.attr('action'),
            method:   form.attr('method'),
            dataType: 'json',
            data,
            success(res) {
                console.log('> Server response', res);
                resolve(res);
            },
            error(err) {
                console.log('> Server ERROR', err);
                resolve(null);
            }
        });

    });
};

export { query };