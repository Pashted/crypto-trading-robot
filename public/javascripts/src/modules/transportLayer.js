import { serializeJSON as toJSON } from "./serializeJSON";

/**
 * Makes ajax queries to the server easier
 * @param method
 * @param clear
 * @returns {Promise}
 */
let query = (method, clear) => {
    console.log('>> RUN_ ' + method);

    let form = $('section form'),
        data = { method };

    if (!clear)
        data.params = toJSON(form.serialize());

    return new Promise((resolve, reject) => {

        $.ajax({
            url:      form.attr('action'),
            method:   form.attr('method'),
            dataType: 'json', data,
            success:  res => resolve(res),
            error:    err => reject(err)
        });

    });
};

let get = target => query('get' + target),
    set = target => query('set' + target),
    reset = target => query('reset' + target, true);

export { get, set, reset };